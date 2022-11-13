angular.module("app", ["ngRoute"])

    .controller("homePageCtrl", ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
        $rootScope.usericon = "images/user-icon.png";
        let isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
            $rootScope.usericon = "images/pic.png";
        } else {
            $rootScope.usericon = "images/user-icon.png";
        }
        $http.get("/api/getData").then(function (response) {
            $rootScope.courses = response.data;
            $scope.courses = response.data;
        });
    }])

    .controller("CourseDetailCtrl", ['$scope', '$routeParams', '$http', '$window', function ($scope, $routeParams, $http, $window) {
        $scope.showInputBox = false;
        $scope.warningMsg = false;
        $scope.id = "/get/" + $routeParams.id;
        $http.get($scope.id).then(function (response) {
            if (response.data) {
                $scope.course = response.data;
            } else {
                $window.location.href = '#';
            }
        });
        $scope.checkUpdate = function () {
            let isLoggedIn = localStorage.getItem("isLoggedIn");
            if (isLoggedIn === "true") {
                $scope.showInputBox = true;
            } else {
                $scope.warningMsg = true;
            }
        };
        $scope.update = function () {
            let url = "/update/course?id=" + $routeParams.id + "&newName=" + $scope.updatedCourse;
            $http.post(url).then(function (response) {
                if (response.data === "0") {
                    $window.alert("INTERNAL SERVER ERROR, please try after sometime...");
                } else {
                    $window.alert("Course Updated Successfully.");
                }
            });
            $scope.updatedCourse = "";
        };
    }])

    .controller("signInCtrl", ['$scope', "$http", "$window", function ($scope, $http, $window) {
        $scope.submit = function () {
            let username = $scope.username;
            let password = $scope.password;
            let url = "/auth?username=" + username + "&password=" + password;
            console.log(url);
            $http.get(url).then(function (response) {
                let userDetail = response.data;
                let resCode = userDetail.resCode;
                localStorage.setItem("name", userDetail.name);
                if (resCode === "1") {
                    $window.alert("Logged-In Successfully");
                    if ($scope.remember) {
                        localStorage.setItem("isLoggedIn", true);
                    }
                    $window.location.href = '#';
                } else if (resCode === "2") {
                    $window.alert("Wrong Password Entered");
                } else if (resCode === "3") {
                    $window.alert("User Doesn't Exist, Please Create New Account");
                } else {
                    $window.alert("INTERNAL SERVER ERROR");
                }
            });
        }
    }])

    .controller("signUpCtrl", ['$scope', '$http', '$window', function ($scope, $http, $window) {
        $scope.submit = function () {
            let uname = $scope.username;
            let name = $scope.name;
            let password = $scope.password;
            let url = "/signup?uname=" + uname + "&name=" + name + "&password=" + password;
            $http.post(url).then(function (response) {
                if (response.data === "0") {
                    $window.alert("User already exist or INTERNAL SERVER ERROR");
                } else {
                    $window.alert("Account Created Successfully, Please Sign-in Again..");
                    $window.location.href = '#!/user/signIn';
                }
            });
        }
    }])

    .controller("profileCtrl", ['$scope', '$window', '$http', function ($scope, $window, $http) {
        $scope.signOut = function () {
            $http.get("/signout").then(function (response) {
                localStorage.setItem("isLoggedIn", false);
                $window.alert("Sign-Out Successfully");
                $window.location.href = '#!/user/signIn';
            }, function (error) {
                $window.alert("INTERNAL SERVER ERROR");
            });

        }
        $scope.name = localStorage.getItem("name");
    }])

    .controller("searchCtrl", ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
        $scope.selectedOptionAuthor = "All";
        $scope.selectedOptionCourse = "All";
        $scope.courses = $rootScope.courses;
        $scope.selectListAuthor = { "All": $scope.courses.length, };
        $scope.selectListCourse = { "All": $scope.courses.length, };
        // for (let i of $scope.courses) {
        //     $scope.selectListAuthor.push(i.value.author);
        // }
        // for (let i of $scope.courses) {
        //     $scope.selectListCourse.push(i.id);
        // }
        for (let i of $scope.courses) {
            if ($scope.selectListAuthor[`${i.value.author}`]) {
                $scope.selectListAuthor[`${i.value.author}`] += 1;
            } else {
                $scope.selectListAuthor[`${i.value.author}`] = 1;
            }
        }
        for (let i of $scope.courses) {
            if ($scope.selectListCourse[`${i.id}`]) {
                $scope.selectListCourse[`${i.id}`] += 1;
            } else {
                $scope.selectListCourse[`${i.id}`] = 1;
            }
        }
    }])

    .directive("dropDown", function () {
        return {
            scope: {
                selectList: '=',
                selected: '=',
            },
            restrict: 'E',
            templateUrl: 'optionTemplate.html',
            link: function (scope, element, attr) {
                scope.show = false;
                scope.toggleOptions = function () {
                    scope.show = !scope.show;
                }
                scope.selectOption = function (select) {
                    scope.selected = select;
                    scope.show = false;
                    if (select === "All") {
                        scope.$root.selected = "";
                    } else {
                        scope.$root.selected = select;
                    }
                }
            }
        }
    })

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/homePage.html',
                controller: 'homePageCtrl'
            })
            .when('/user/signIn', {
                templateUrl: function () {
                    let isLoggedIn = localStorage.getItem("isLoggedIn");
                    localStorage.userCtrl = isLoggedIn === "true" ? 'profileCtrl' : 'signInCtrl';
                    return isLoggedIn === "true" ? '/profile.html' : '/signIn.html';
                },
                controller: localStorage.getItem("userCtrl")
            })
            .when('/user/profile', {
                templateUrl: '/profile.html',
                controller: 'profileCtrl'
            })
            .when('/user/signUp', {
                templateUrl: '/signUp.html',
                controller: 'signUpCtrl'
            })
            .when('/courses/search', {
                templateUrl: '/search.html',
                controller: 'searchCtrl'
            })
            .when('/:id', {
                templateUrl: '/CourseDetail.html',
                controller: 'CourseDetailCtrl'
            });
    }]);
