'use strict';

angular.module('ancients')
  .controller('MainCtrl', function ($scope, $rootScope, $http) {
    $scope.query = '';
    var url = 'https://athena-7.herokuapp.com/ancients.json';

    $scope.fetch = function(){
      $http.get(url, {cache:true}).
        success(function(data, status, headers, config) {
          // NOTE: We want to make sure we have something to display
          if(data.length ===0){
            $scope.empty = true;
            return;
          }
          //NOTE: Parsing results into uppercase for the name and superpower
          $scope.empty = false;
          $.each(data, function(index, ancient){
            ancient.name = ancient.name.toUpperCase();
            ancient.superpower = ancient.superpower.toUpperCase();
          });
          $scope.ancients = data;
        }).
        error(function(data, status, headers, config) {
          // NOTE: We could have some errors handling here
        });
    };

    var pendingCall;
    //NOTE: We search automaticaly on change of input value
    $scope.change = function(){
      if($scope.query === ''){
        $scope.fetch();
        return;
      }
      //NOTE: We don't want to make a request with invalid query
      //      If the search query doesn't match the RegEx angular doesn't set the model so checking the input value instead
        if(!/^[a-zA-Z\s]+$/.test($('#search-query').val()))
        return;
      
      //NOTE: We want to wait until the user stops typing before making a request, waiting 800ms
      if(pendingCall) 
        clearTimeout(pendingCall);
      pendingCall = setTimeout($scope.search(), 800);
    };

    $scope.search = function(){
      $http.get(url + '?search=' + 
        $scope.query.charAt(0).toUpperCase() + $scope.query.slice(1),
        {cache:true})
      .success(function(data, status, headers, config){
        // NOTE: We want to make sure we have something to display
        if(data.ancients.length === 0){
          $scope.empty = true;
          $scope.ancients = [];
          return;
        }
        $scope.empty = false;
        $.each(data.ancients, function(index, ancient){
          ancient.name = ancient.name.toUpperCase();
          ancient.superpower = ancient.superpower.toUpperCase();
        });
        $scope.ancients = data.ancients;
      });
    };


    $scope.showError = function(){
      $http.get(url + '?error=true')
      .error(function(data, status, headers, config){
        $scope.error = data.error;
       
      });
    };

    $scope.fetch();
    //NOTE: Not sure when or where the error should be displayed so just getting it straight away
    $scope.showError();
  });


