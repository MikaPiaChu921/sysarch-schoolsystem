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

  $rootScope.studentList = [];
  $scope.newStudent = {
    idno: "",
    lastname: "",
    firstname: "",
    course: "",
    level: "",
  };

  $scope.getStudentsList = () => {
    $http({
      method: "get",
      url: "students",
    }).then(function (response) {
      $rootScope.studentList = response.data.students;
    });
  };

  // edit student
  $scope.EditStudent = function (student) {
    student.edit = !student.edit;
    student.editted = true;
  };

  // save table
  $scope.SaveTable = () => {
    // save the table in the database
    let rowsAffected = 0;
    for (let student of $rootScope.studentList) {
      if (student.editted) {
        $http({
          method: "put",
          url: "students",
          data: student,
        }).then((r) => {});
        rowsAffected++;
      }
    }
    $scope.getStudentsList();
    alert("Data saved! " + rowsAffected + " row(s) affected");
  };

  // add new student
  $scope.AddStudent = () => {
    if ($scope.newStudent.idno === "") {
      alert("Id number should not be empty");
      return;
    }
    $http({
      method: "post",
      url: "students",
      data: $scope.newStudent,
    }).then((r) => {
      $scope.getStudentsList();
      $scope.newStudent = {
        idno: "",
        lastname: "",
        firstname: "",
        course: "",
        level: "",
      };
      alert("New Student Added");
    });
  };

  // delete student
  $scope.DeleteStudent = (idno) => {
    $http({
      method: "delete",
      url: `students/${idno}`,
    }).then((r) => {
      $scope.getStudentsList();
      alert("Deleted Student with id number: " + idno);
    });
  };

  // reset form
  $scope.ResetForm = () => {
    $scope.newStudent = {
      idno: "",
      lastname: "",
      firstname: "",
      course: "",
      level: "",
    };
  };
  $scope.getStudentsList();
});

//
app.filter("startFrom", function () {
  return function (input, start) {
    start = +start;
    return input.slice(start);
  };
});
