system.controller("TeamController", TeamController);
function TeamController($scope, $http, $rootScope, io) {
    $scope.tasks = [];
    $scope.username = "";
    var self = this;
    this.__proto__ = new BaseController($scope, $http, $rootScope);
    this.init = function() {
        $scope.addTask();
    };
    $scope.addTask = function() {
        $scope.tasks.push({
            value: 0,
            childs: []
        });
        setTimeout(function() {
            $(".estimated-value").last().focus();
            $(".estimated-value").last().select();
        }, 100);
    };
    $scope.removeTask = function() {
        if ($scope.tasks.length > 1) {
            $scope.tasks.splice(-1,1);
        }
    };
    $scope.submit = function() {
        if ($scope.username == null || $scope.username == "") {
            var username = prompt("Please enter your name", "");
            if (username != null && username != "") {
                $scope.username = username
            }
        }
        if ($scope.username != null && $scope.username != "") {
            self.emitData();
            alert("Thank " + $scope.username + " for your submitting");
        }
    };
    $scope.calculateEstimatedTime = function() {
        var retval = 0;
        for (var i = 0; i < $scope.tasks.length; i++) {
            if (typeof $scope.tasks[i].value !== 'undefined' && $scope.tasks[i].value != null) {
                retval += $scope.tasks[i].value;
            }
        }
        return retval;
    };

    $scope.addChildTask = function (task) {
        task.childs.push({
            value: 0
        });
    };

    $scope.removeChildTask = function (task) {
        task.childs.splice(-1,1);
    };

    $scope.changeChildValue = function (task) {
        var totalValue = 0;
        task.childs.forEach(function(child) {
            if (child.value != null) {
                totalValue += child.value;
            }
        });
        task.value = totalValue;
    };

    this.emitData = function() {
        io.emit("team.submit", {
            username: $scope.username,
            tasks: $scope.tasks
        });
    }
    this.init();
}
