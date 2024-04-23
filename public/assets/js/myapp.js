//using es5 javascript
var app = angular.module("myapp", ["ngRoute"]);

function GetLoggedInUser() {
  cookieData = document.cookie.split("; ");

  for (let i = 0; i < cookieData.length; i++) {
    cookieData[i] = cookieData[i].split("=");
    cookieName = cookieData[i][0];
    cookieValue = cookieData[i][1];

    if (cookieName === "sessionCookie") {
      return cookieValue;
    }
  }
  return undefined;
}

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
    controller: "subjectctrl",
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
    controller: "subjectctrl",
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
    controller: "subjectctrl",
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

app.controller("subjectctrl", function ($scope, $http, $location, $rootScope) {
  $scope.pagesizes = [5, 10, 15, 20];
  $scope.pageSize = 5;
  $scope.currentPage = 0;
  $scope.search = "";

  $scope.logout = function () {
    // logout the user
    $rootScope.loggedIn = false;
    $location.path("/");
    document.cookie = "sessionCookie=; Max-Age=-99999999;";
  };

  $scope.subjectList = [];
  const initDate = () => {
    const date = new Date();
    date.setHours(7);
    date.setMinutes(30);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };
  $scope.newSubject = {
    time_1: initDate(),
    time_2: initDate(),
  };

  $scope.RetrieveSubjects = () => {
    $http({
      method: "get",
      url: "subject",
    }).then((response) => {
      $scope.subjectList = response.data.subjects;
      for (let subject of $scope.subjectList) {
        const time_1_orig = subject.time.split("-");
        subject.time_1 = new Date();
        subject.time_1.setHours(time_1_orig[0].split(":")[0]);
        subject.time_1.setMinutes(time_1_orig[0].split(":")[1]);
        subject.time_1.setSeconds(0);
        subject.time_1.setMilliseconds(0);

        subject.time_2 = new Date();
        subject.time_2.setHours(time_1_orig[1].split(":")[0]);
        subject.time_2.setMinutes(time_1_orig[1].split(":")[1]);
        subject.time_2.setSeconds(0);
        subject.time_2.setMilliseconds(0);

        const time_1 = new Date(subject.time_1);
        const time_2 = new Date(subject.time_2);
        subject.time =
          (time_1.getHours() > 12
            ? time_1.getHours() - 12
            : time_1.getHours()) +
          ":" +
          new String(time_1.getMinutes()).padStart(2, "0") +
          "-" +
          (time_2.getHours() > 12
            ? time_2.getHours() - 12
            : time_2.getHours()) +
          ":" +
          new String(time_2.getMinutes()).padStart(2, "0");
      }
    });
  };

  // Toggle Edit Subject
  $scope.ToggleEdit = (subject) => {
    if (!subject.time_1 && !subject.time_2) {
      const time_1_orig = subject.time.split("-");
      subject.time_1 = new Date();
      subject.time_1.setHours(time_1_orig[0].split(":")[0]);
      subject.time_1.setMinutes(time_1_orig[0].split(":")[1]);
      subject.time_1.setSeconds(0);
      subject.time_1.setMilliseconds(0);

      subject.time_2 = new Date();
      subject.time_2.setHours(time_1_orig[1].split(":")[0]);
      subject.time_2.setMinutes(time_1_orig[1].split(":")[1]);
      subject.time_2.setSeconds(0);
      subject.time_2.setMilliseconds(0);
    } else {
      const time_1 = new Date(subject.time_1);
      const time_2 = new Date(subject.time_2);
      subject.time =
        (time_1.getHours() > 12 ? time_1.getHours() - 12 : time_1.getHours()) +
        ":" +
        new String(time_1.getMinutes()).padStart(2, "0") +
        "-" +
        (time_2.getHours() > 12 ? time_2.getHours() - 12 : time_2.getHours()) +
        ":" +
        new String(time_2.getMinutes()).padStart(2, "0");
    }

    subject.edit = !subject.edit;
    subject.editted = true;
  };

  $scope.DeleteSubject = (edpcode) => {
    const deleteConfirmation = prompt("Type 'delete' to proceed");
    if (deleteConfirmation.toLocaleLowerCase() !== "delete") return;
    $http({
      method: "delete",
      url: `subject/${edpcode}`,
    }).then((r) => {
      $scope.RetrieveSubjects();
      alert("Subject deleted");
    });
  };

  $scope.SaveTable = () => {
    let rowsAffected = 0;
    for (let subject of $scope.subjectList) {
      if (subject.editted) {
        const time_1 = new Date(subject.time_1);
        const time_2 = new Date(subject.time_2);
        subject.time =
          (time_1.getHours() > 12
            ? time_1.getHours() - 12
            : time_1.getHours()) +
          ":" +
          new String(time_1.getMinutes()).padStart(2, "0") +
          "-" +
          (time_2.getHours() > 12
            ? time_2.getHours() - 12
            : time_2.getHours()) +
          ":" +
          new String(time_2.getMinutes()).padStart(2, "0");

        $http({
          method: "put",
          url: "subject",
          data: subject,
        });

        rowsAffected++;
      }

      $scope.RetrieveSubjects();
    }
    alert(`Data saved! ${rowsAffected} row(s) affected.`);
  };

  $scope.SaveSubject = (newSubject) => {
    if (!newSubject.edpcode) {
      alert("Edpcode should not be empty!");
      return;
    }
    let subject = {
      edpcode: newSubject.edpcode ?? "",
      subjectcode: newSubject.subjectcode ?? "",
      days: `${newSubject.M ? "M" : ""}${newSubject.T ? "T" : ""}${
        newSubject.W ? "W" : ""
      }${newSubject.TH ? "TH" : ""}${newSubject.F ? "F" : ""}${
        newSubject.S ? "S" : ""
      }`,
      room: newSubject.room ?? "",
    };

    const time_1 = new Date(newSubject.time_1);
    const time_2 = new Date(newSubject.time_2);
    subject.time =
      (time_1.getHours() > 12 ? time_1.getHours() - 12 : time_1.getHours()) +
      ":" +
      new String(time_1.getMinutes()).padStart(2, "0") +
      "-" +
      (time_2.getHours() > 12 ? time_2.getHours() - 12 : time_2.getHours()) +
      ":" +
      new String(time_2.getMinutes()).padStart(2, "0");
    $http({
      method: "post",
      url: "subject",
      data: subject,
    }).then((r) => {
      $scope.RetrieveSubjects();
      alert("Subject added.");
    });
  };

  /* ENROLLMENT AND REPORT RELATED */

  $scope.StudentID = undefined;
  $scope.StudentData = undefined;
  $scope.studentList = [];
  $scope.studentEnrolledSubjects = [];
  $scope.SubjectData = undefined;
  $scope.EDPCODE = undefined;
  $scope.Enrolled = false;
  $scope.EnrolledStudents = [];
  $scope.TempToDeleteStudent = [];

  $scope.getStudentsList = () => {
    $http({
      method: "get",
      url: "students",
    }).then(function (response) {
      $scope.studentList = response.data.students;
    });
  };

  $scope.LoadEnrolledSubjects = () => {
    // clear the subjects
    $scope.studentEnrolledSubjects = [];
    $http({
      method: "get",
      url: "enrollment",
    }).then(({ data }) => {
      for (let enrollmentData of data) {
        if (enrollmentData.idno === $scope.StudentData.idno) {
          for (const subject of $scope.subjectList) {
            if (subject.edpcode === enrollmentData.edpcode) {
              $scope.studentEnrolledSubjects.push(subject);
            }
          }
        }
      }
    });
  };

  $scope.LoadEnrolledStudents = () => {
    // clear the subjects
    $scope.EnrolledStudents = [];
    if (!$scope.SubjectData) return;

    $http({
      method: "get",
      url: "enrollment",
    }).then(({ data }) => {
      for (let enrollmentData of data) {
        if (enrollmentData.edpcode === $scope.SubjectData.edpcode) {
          for (let student of $scope.studentList) {
            if (student.idno === enrollmentData.idno) {
              $http({
                method: "get",
                url: `user/${enrollmentData.enrolled_by}`,
              }).then(({ data }) => {
                student.enrolled_by = data[0].email;
                $scope.EnrolledStudents.push(student);
              });
            }
          }
        }
      }
    });
  };

  $scope.FindStudent = (StudentID) => {
    if (!$scope.StudentID) {
      alert("Student ID should not be empty!");
      return;
    }
    $scope.StudentData = undefined;
    $scope.SubjectData = undefined;
    $scope.studentEnrolledSubjects = [];

    for (const student of $scope.studentList) {
      if (student.idno === StudentID + "") {
        $scope.StudentData = student;
        $scope.LoadEnrolledSubjects();
        break;
      }
    }
    if (!$scope.StudentData) {
      setTimeout(() => {
        alert("Couldn't find student");
      }, 200);
    }
  };

  $scope.FindSubject = () => {
    $scope.SubjectData = undefined;
    $scope.Enrolled = false;

    if (!$scope.EDPCODE) {
      alert("EDPCODE should not be empty!");
      return;
    }

    for (const subject of $scope.subjectList) {
      if (subject.edpcode === "" + $scope.EDPCODE) {
        $scope.SubjectData = subject;
        for (let enrolledSubjects of $scope.studentEnrolledSubjects) {
          if (enrolledSubjects.edpcode === subject.edpcode) {
            $scope.Enrolled = true;
            break;
          }
        }
      }
    }

    $scope.LoadEnrolledStudents();
    if (!$scope.SubjectData) {
      alert("Coudn't find Course");
    }
  };

  $scope.Enroll = () => {
    if (!$scope.SubjectData) return;
    if (!$scope.StudentData) return;

    $http({
      method: "post",
      url: "enrollment",
      data: {
        idno: $scope.StudentData.idno,
        edpcode: $scope.SubjectData.edpcode,
        enrolled_by: GetLoggedInUser() ?? 0,
      },
    }).then((r) => {
      $scope.RetrieveSubjects();
      $scope.getStudentsList();
      $scope.LoadEnrolledSubjects();
      $scope.SubjectData = undefined;
      setTimeout(() => {
        alert(r.data.Message);
      }, 500);
    });
  };

  $scope.SaveEnrollment = () => {
    let rowsAffected = 0;
    for (let enrolledSubject of $scope.studentEnrolledSubjects) {
      if (enrolledSubject.toDelete) {
        $http({
          method: "delete",
          url: `enrollment/${$scope.StudentData.idno}/${enrolledSubject.edpcode}`,
        });
        rowsAffected++;
      }
    }

    if (rowsAffected > 0) {
      alert(`Data Saved! ${rowsAffected} row(s) affected.`);
      $scope.LoadEnrolledSubjects();
    }
  };

  // Clear Enrollment User
  $scope.ClearEnrollment = () => {
    $scope.StudentID = undefined;
    $scope.StudentData = undefined;
    $scope.studentList = [];
    $scope.studentEnrolledSubjects = [];
    $scope.SubjectData = undefined;
    $scope.EDPCODE = undefined;
    $scope.Enrolled = false;
  };

  // DeleteEnrolledStudents
  $scope.DeleteEnrolledStudents = () => {
    $scope.TempToDeleteStudent = [];
    $scope.TempToDeleteStudent = $scope.EnrolledStudents.filter(
      (e) => e.toDelete
    );
    $scope.EnrolledStudents = $scope.EnrolledStudents.filter(
      (e) => !e.toDelete
    );
  };

  // SaveReport
  $scope.SaveReport = () => {
    let rowsAffected = 0;
    for (let enrolledStudent of $scope.TempToDeleteStudent) {
      if (enrolledStudent.toDelete) {
        $http({
          method: "delete",
          url: `enrollment/${enrolledStudent.idno}/${$scope.SubjectData.edpcode}`,
        });
        rowsAffected++;
      }
    }

    if (rowsAffected > 0) {
      alert(`Data Saved! ${rowsAffected} row(s) affected.`);
      $scope.LoadEnrolledStudents();
    }
  };

  $scope.RetrieveSubjects();
  $scope.getStudentsList();

  $scope.numberOfPagesSub = function () {
    return Math.ceil($scope.subjectList.length / $scope.pageSize);
  };

  // $scope.numberOfPagesEnrollment = function () {
  //   return Math.ceil($scope.studentEnrolledSubjects.length / $scope.pageSize);
  // };

  // $scope.numberOfPagesReport = function () {
  //   return Math.ceil($scope.EnrolledStudents.length / $scope.pageSize);
  // };

  $scope.nextPage = function () {
    $scope.currentPage++;
  };
});
///
app.controller("mainctrl", function ($scope, $http, $location, $rootScope) {
  $scope.pagesizes = [5, 10, 15, 20];
  $scope.pageSize = 5;
  $scope.currentPage = 0;
  $scope.search = "";

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
    const deleteConfirmation = prompt("Type 'delete' to proceed");
    if (deleteConfirmation.toLocaleLowerCase() !== "delete") return;
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

  $scope.numberOfPages = function () {
    return Math.ceil($rootScope.studentList.length / $scope.pageSize);
  };

  $scope.nextPage = function () {
    $scope.currentPage++;
  };
});

//
app.filter("startFrom", function () {
  return function (input, start) {
    start = +start;
    return input.slice(start);
  };
});

//
app.filter("startFrom", function () {
  return function (input, start) {
    start = +start;
    return input.slice(start);
  };
});
