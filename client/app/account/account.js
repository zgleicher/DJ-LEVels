'use strict';

angular.module('levelsApp')
  .config(function ($stateProvider, $authProvider) {
    $stateProvider
      // .state('login', {
      //   url: '/login',
      //   templateUrl: 'app/account/login/login.html',
      //   controller: 'LoginCtrl'
      // })
      // .state('signup', {
      //   url: '/signup',
      //   templateUrl: 'app/account/signup/signup.html',
      //   controller: 'SignupCtrl'
      // })
      .state('soundcloud', {
        url:'/soundcloud',
        templateUrl: 'app/account/soundcloud/soundcloud.html',
        controller: 'SoundcloudCtrl'
      });
      // .state('settings', {
      //   url: '/settings',
      //   templateUrl: 'app/account/settings/settings.html',
      //   controller: 'SettingsCtrl',
      //   authenticate: true
      // });
    var host = location.protocol + '//' + location.host;
    console.log('host is ' + host);
    $authProvider.oauth2({
      name: 'soundcloud',
      url: '/auth/soundcloud',
      // redirectUri: 'http://localhost:9000/auth/soundcloud',
      redirectUri: host + '/auth/soundcloud',
      clientId: '66fd2fb89c48bdcf4d67c15d99baf2a8',
      authorizationEndpoint: 'https://soundcloud.com/connect',
      requiredUrlParams: ['scope'],
      scope: 'non-expiring'
    });
    
    $authProvider.loginRedirect = '/landing';
  });