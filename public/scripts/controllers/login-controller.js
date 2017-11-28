app.controller('LoginController', ['DataFactory', 'TopicsFactory', '$firebaseAuth', '$http', '$location', '$scope', '$route', function(DataFactory, TopicsFactory, $firebaseAuth, $http, $location, $scope, $route){

  //google authenticate bellow
  var auth = $firebaseAuth();
  var self = this;
  var firebaseUser = auth.$getAuth();

  //controls the state of the modal
  self.loginModalShown = false;

  self.toggleModal = function() {
    console.log("toggleModal");
    self.loginModalShown = !self.loginModalShown;
  };

    // var notyf = new Notyf();

  TopicsFactory.checkAdminStatus().then(function(response){
    self.isAdmin = TopicsFactory.isAdmin;
    var name = firebaseUser.displayName;
    var split = name.split(" ");
    self.name = split[0];
  });
  // self.isAdmin = TopicsFactory.isAdmin;

  auth.$onAuthStateChanged(function(firebaseUser) {
   if (firebaseUser) {
     self.email = true;
     $scope.$apply();
     TopicsFactory.checkAdminStatus().then(function(response){
       self.isAdmin = TopicsFactory.isAdmin;
       var name = firebaseUser.displayName;
       var split = name.split(" ");
       self.name = split[0];
     });
     // go reload idea data....
    //  DataFactory.init();
   } else {
     $scope.$apply();
     // redirect
     self.email = '';
     TopicsFactory.checkAdminStatus().then(function(response){
       self.isAdmin = TopicsFactory.isAdmin;
           var name = firebaseUser.displayName;
           var split = name.split(" ");
           self.name = split[0];
     });
    //  self.logout();
   }
  });

  // //user google login authentication
  // self.login = function() {
  //   //popup google signup
  //   auth.$signInWithPopup("google").then(function(firebaseUser) {
  //     //checks to see if the user is in the database.
  //     DataFactory.checkUserStatus();
  //     if(DataFactory.email.status){
  //       self.email = firebaseUser.email;
  //       //user is in the database. Don't do anything.
  //     } else if (!DataFactory.email.status){
  //       //user is not in the database. Send them to address form.
  //       self.email = ''; //sets button to LOGOUT
  //       loginView();
  //     }
  //   }).catch(function(error) {
  //     console.log("Authentication failed: ", error);
  //   });//end of .catch
  // };//end of self.login()

//check for user in database
function checkDatabaseForUser() {
  DataFactory.checkUserStatus().then(function(response){
    if(response.data == true){
      self.email = true;
      //user is in the database. Don't do anything.
    } else if (response.data == false){
      //user is not in the database. Send them to address form.
      loginView();
      self.email = ''; //sets button to LOGOUT
      $scope.$apply();
    }
  }).catch(function(error){
    console.error("Checking database for user information failed: ", error);
  });
}

//logs in using google, facebook, or twitter
self.socialLogin = function(provider) {
  console.info("socialLogin passed: ", provider);
  auth.$signInWithPopup(provider).then(function(firebaseUser){
    console.info("Signed in as:", firebaseUser.user.uid);
    //check database
    checkDatabaseForUser();
  }).catch(function(error){
    console.error("Authentication failed: ", error);
  });//end of .catch
};//end of socialLogin

//Regular email password login
  self.passwordLogin = function(email, password) {
    auth.$signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
      console.info("Signed in as:", firebaseUser.user.uid);
      //checks if user is within database
      checkDatabaseForUser();
  }).catch(function(error){
    console.error("Authentication failed: ", error);
  });
};

  //When user hits logout
  self.logout = function() {
    // console.log("logout clicked");
    auth.$signOut().then(function() {
      self.email = '';
      self.isAdmin = '';
      $route.reload();
    });//end of auth.$signOut()
  };//end of self.deAuthUser()

  //new user object from view button click
  self.addNewUser = function(user) {
    //creating a new variable with input data and firebase data
    var newUser = {
      name : firebaseUser.displayName,
      address : user.street,
      city : user.city,
      state : user.state,
      zipCode :  user.zipCode,
      email : firebaseUser.email,
      photo : firebaseUser.photoURL,
      ward : ""
    };
    //sends object to DB
    DataFactory.addNewUser(newUser);
    //empties inputs after submission
    self.user = {};
    //redirects back to home view after submission
    logoutView();
    self.email = true;
  };

  //redirect to address form
  function loginView() {
    $location.path('/login');
  }
  //redirect to home
  function logoutView() {
    self.email = firebaseUser.email;
    $location.path('/home');
  }
  //redirect to admin view
  self.adminView = function() {
    $location.path('/admin-flags');
  };

}]);//end of app.controller()
