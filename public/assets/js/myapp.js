//using es5 javascript
var app = angular.module("myapp", ["ngRoute"]);

app.config(function ($routeProvider) {
  function IsLoggedIn() {
    cookieData = document.cookie.split("; ");

    for (let i = 0; i < cookieData.length; i++) {
      cookieData[i] = cookieData[i].split("=");
      cookieName = cookieData[i][0];
      cookieValue = cookieData[i][1];

      if (cookieName === "sessionCookie") {
        return true;
      }
    }
    return false;
  }
  $routeProvider.when("/", {
    templateUrl: "login.html",
    controller: "loginctrl",
  });
  $routeProvider.when("/student", {
    templateUrl: "student.html",
    controller: "mainctrl",
    resolve: {
      check: function ($location, $rootScope) {
        if (!IsLoggedIn()) {
          $location.path("/");
          $rootScope.message = "Logged Properly";
        }
      },
    },
  });
  $routeProvider.when("/subject", {
    templateUrl: "subject.html",
    controller: "mainctrl",
    resolve: {
      check: function ($location, $rootScope) {
        if (!IsLoggedIn()) {
          $location.path("/");
          $rootScope.message = "Logged Properly";
        }
      },
    },
  });
  $routeProvider.when("/enrollment", {
    templateUrl: "enrollment.html",
    controller: "mainctrl",
    resolve: {
      check: function ($location, $rootScope) {
        if (!IsLoggedIn()) {
          $location.path("/");
          $rootScope.message = "Logged Properly";
        }
      },
    },
  });
  $routeProvider.when("/report", {
    templateUrl: "reports.html",
    controller: "mainctrl",
    resolve: {
      check: function ($location, $rootScope) {
        if (!IsLoggedIn()) {
          $location.path("/");
          $rootScope.message = "Logged Properly";
        }
      },
    },
  });
});
///
app.controller("loginctrl", function ($scope, $rootScope, $location, $http) {
  $rootScope.loggedIn = false;
  // clear cookie
  document.cookie = "sessionCookie=; Max-Age=-99999999;";

  $scope.login = function () {
    var email = $scope.email;
    var password = $scope.password;
    $http({
      method: "post",
      url: "userlogin",
      data: {
        email: email,
        password: password,
      },
    }).then(function (response) {
      $scope.user = response.data;
      if ($scope.user.length > 0) {
        $rootScope.loggedIn = true;
        $location.path("/student");
      } else $rootScope.message = "Invalid User";
    });

    if (email === "validUsername" && password === "validPassword") {
      // If valid, proceed with login logic
      console.log("Login successful");
      $scope.loginError = false; // Reset login error flag
    } else {
      // If invalid, display error message
      console.log("Invalid username or password!");
      $scope.loginError = true;
    }
  };

  $scope.register = function () {
    $location.path("/registration");
  };
});
///
app.controller("mainctrl", function ($scope, $http, $location, $rootScope) {
  $scope.logout = function () {
    // logout the user
    $rootScope.loggedIn = false;
    $location.path("/");
    document.cookie = "sessionCookie=; Max-Age=-99999999;";
  };
});

//
app.filter("startFrom", function () {
  return function (input, start) {
    start = +start;
    return input.slice(start);
  };
});
