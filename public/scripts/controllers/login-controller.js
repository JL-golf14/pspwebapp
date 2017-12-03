app.controller('LoginController', ['DataFactory', 'TopicsFactory', '$firebaseAuth', '$http', '$location', '$scope', '$route', '$uibModal', function(DataFactory, TopicsFactory, $firebaseAuth, $http, $location, $scope, $route, $uibModal){

  //google authenticate bellow
  var auth = $firebaseAuth();
  var self = this;
  var firebaseUser = auth.$getAuth();

  //controls the state of the modal
  $scope.openModal = function() {
    console.log('opening login modal');
    $scope.$modalInstance = $uibModal.open({
    scope: $scope,
    templateUrl: 'views/templates/password_login_modal.html',
    });
  };

  function closeModal() {
    console.log('closing login modal');
    $scope.$modalInstance.dismiss();
  }
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
  self.passwordLogin = function() {
    closeModal();
    auth.$signInWithEmailAndPassword($scope.email, $scope.password).then(function(firebaseUser) {
      console.info("Signed in as:", firebaseUser.user.uid);
      //checks if user is within database 
      checkDatabaseForUser();
      
  }).catch(function(error){
    console.error("Authentication failed: ", error);
    if (error.code == "auth/user-not-found") {
      registerWithEmail();
    }
  });
};

//register user with email/password
  registerWithEmail = function() {
    closeModal();
    auth.$createUserWithEmailAndPassword($scope.email, $scope.password).then(function(firebaseUser) {
      //checks if user is within database 
      checkDatabaseForUser();
      
    }).catch(function(error) {
      console.error("User registration failed: ", error);
    })
  };

  //When user hits logout
  self.logout = function() {
    // console.log("logout clicked");
    auth.$signOut().then(function() {
      self.email = '';
      self.isAdmin = '';
      $location.path('/home');
      //$route.reload();
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
