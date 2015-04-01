'use strict';

angular.module('levelsApp')
  .config(['$stateProvider', '$authProvider', function ($stateProvider, $authProvider) {
    $stateProvider
      .state('soundcloud', {
        url:'/soundcloud',
        templateUrl: 'app/account/soundcloud/soundcloud.html',
        controller: 'SoundcloudCtrl'
      });
    var host = location.protocol + '//' + location.host;
    $authProvider.oauth2({
      name: 'soundcloud',
      url: '/auth/soundcloud',
      redirectUri: host + '/auth/soundcloud',
      //local
      clientId: '66fd2fb89c48bdcf4d67c15d99baf2a8',
      //production
      // clientId: '8404d653618adb5d684fa8b257d4f924',
      authorizationEndpoint: 'https://soundcloud.com/connect',
      requiredUrlParams: ['scope'],
      scope: 'non-expiring'
    });
    
    $authProvider.loginRedirect = '/landing';
  }]);