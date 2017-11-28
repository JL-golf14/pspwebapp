app.controller('NavCtrl', ['$firebaseAuth', '$http', '$location', 'TopicsFactory', '$routeParams', function($firebaseAuth, $http, $location, TopicsFactory, $routeParams){
  var self = this;
  // var self = this;
  // var auth = $firebaseAuth();
  //loads the active subtopics onto the nav.
  self.index = $routeParams.id;
  self.params = $location.$$url;
  TopicsFactory.findActiveSubTopics();
  //Here is the result/active subtopics
  self.subTopic = TopicsFactory.subTopic;

  //sets the currently selected nav to a different class/color
  this.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };

  self.redirect = function(url) {
    if (url == 'home'){
      $location.path('/home');
    } else {
      $location.path('/subtopics/' + url);
    }
  };



  // TopicsFactory.checkAdminStatus();
  // self.isAdmin = TopicsFactory.isAdmin;

  // auth.$onAuthStateChanged(function(firebaseUser) {
  //   TopicsFactory.checkAdminStatus();
  //   self.isAdmin = TopicsFactory.isAdmin;
  //   if(firebaseUser){
  //
  //   }
  // });

}]);
