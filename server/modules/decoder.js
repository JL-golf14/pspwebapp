
var pool = require('../modules/database-config');
var admin = require("firebase-admin");

// var logger = require('./logger');

if (process.env.LOCAL){
  var serviceAccount = require("../firebase-service-account.json");
  admin.initializeApp({
    credential: admin.credential.cert({serviceAccount}),
    databaseURL: "https://psp-group.firebaseio.com/", // replace this line with your URL
   });
} else {
  admin.initializeApp({
    credential: admin.credential.cert({
     "private_key": process.env.FIREBASE_PRIVATE_KEY,
     "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: "https://psp-group.firebaseio.com/", // replace this line with your URL
   });
}

/* This is where the magic happens. We pull the id_token off of the request,
verify it against our firebase service account private_key.
Then we add the decodedToken */
var tokenDecoder = function (req, res, next) {
  if (req.headers.id_token) {
    admin.auth().verifyIdToken(req.headers.id_token).then(function (decodedToken) {
      // console.log(req.decodedToken);
      req.decodedToken = decodedToken;
      pool.connect(function (err, client, done) {
        var firebaseUserId = req.decodedToken.user_id || req.decodedToken.uid;
        client.query('SELECT id, admin FROM users WHERE email=$1', [req.decodedToken.email], function (err, userSQLIdResult) {
          done();
          if (err) {
            console.log('Error completing user id query task', err);
            res.sendStatus(500);
          } else {
            pool.connect(function (err, client, done) {
              done();
              if (userSQLIdResult.rows.length === 1) {
                console.log('found user: ', userSQLIdResult.rows);
                // this else is for users that already exist. This should be the most common path
                // this adds the user's id from the database to the request to simplify future database queries
                req.decodedToken.userSQLId = userSQLIdResult.rows[0].id;
                req.decodedToken.admin = userSQLIdResult.rows[0].admin;
                next();
              } else if (userSQLIdResult.rows.length === 0) {
                console.log('could not find user in DB');
                res.send({user: null});
              } else {
                console.log('here');
                res.sendStatus(403);
              }
            });
          }
        });
      });
    })
      .catch(function (error) {
        // If the id_token isn't right, you end up in this callback function
        // Here we are returning a forbidden error
        console.error('User token could not be verified:', error);
        res.sendStatus(403);
      });
  } else {
    // Seems to be hit when chrome makes request for map files
    // Will also be hit when user does not send back an idToken in the header
    // technically, some of these should return 403 and some should return 404
    res.sendStatus(405);
  }
};

module.exports = {
 token: tokenDecoder,
};
