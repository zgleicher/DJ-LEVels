'use strict';

angular.module('levelsApp')
.controller('LandingCtrl', function ($scope) {
  $scope.message = 'Hello';

  var allAvatars = [ ],
  allGroups = [ ];

  $scope.selected      = null;
  $scope.avatars       = allAvatars;
  $scope.selectAvatar  = selectAvatar;
  $scope.toggleSidenav = toggleSideNav;
  $scope.showActions   = showActions;
    //new
    $scope.selectedGroup = null;
    $scope.groups        = allGroups;
    $scope.selectGroup   = selectGroup;

    loadAvatars();
    loadGroups();

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Load all available avatars
     * @param menuId
     *
     */
     function loadAvatars() {
      avatarsService
      .loadAll()
      .then( function( avatars ) {
        allAvatars = avatars;

        $scope.avatars = [].concat(avatars);
        $scope.selected = avatars[0];
      });
    }

    function loadGroups() {
      groupService
      .loadAll()
      .then( function( groups ) {
        allGroups = groups;

        $scope.groups = [].concat(groups);
        $scope.selectedGroup = groups[0];
      });
    }
    /**
     * Hide or Show the sideNav area
     * @param menuId
     */
     function toggleSideNav( name ) {
      $mdSidenav(name).toggle();
    }

    /**
     * Select the current avatars
     * @param menuId
     */
     function selectAvatar ( avatar ) {
      $scope.selected = angular.isNumber(avatar) ? $scope.avatars[avatar] : avatar;
      $scope.toggleSidenav('left');
    }

    function selectGroup( group ) {
      $scope.selectedGroup = angular.isNumber(group) ? $scope.groups[group] : group;
      $scope.toggleSidenav('left');
    }

    /**
     * Show the bottom sheet
     */
     function showActions($event) {

      $mdBottomSheet.show({
        parent: angular.element(document.getElementById('content')),
        template: '<md-bottom-sheet class="md-list md-has-header">' +
        '<md-subheader>Avatar Actions</md-subheader>' +
        '<md-list>' +
        '<md-item ng-repeat="item in vm.items">' +
        '<md-button ng-click="vm.performAction(item)">{{item.name}}</md-button>' +
        '</md-item>' +
        '</md-list>' +
        '</md-bottom-sheet>',
        bindToController : true,
        controllerAs: "vm",
        controller: [ '$mdBottomSheet', AvatarSheetController],
        targetEvent: $event
      }).then(function(clickedItem) {
        $log.debug( clickedItem.name + ' clicked!');
      });

        /**
         * Bottom Sheet controller for the Avatar Actions
         */
         function AvatarSheetController( $mdBottomSheet ) {
          this.items = [
          { name: 'Share', icon: 'share' },
          { name: 'Copy', icon: 'copy' },
          { name: 'Impersonate', icon: 'impersonate' },
          { name: 'Singalong', icon: 'singalong' },
          ];
          this.performAction = function(action) {
            $mdBottomSheet.hide(action);
          };
        }
      }

    });
