(function() {
  'use strict';

  angular
    .module('ipmApp.settings.loginPassword.component', [
      'ionic',
      'ipmApp.vault.service',
      'ipmApp.settings.service'
    ])
    .component('settingsLoginPassword', settingsLoginPassword());

  function settingsLoginPassword() {
    var component = {
      templateUrl: 'app/settings/settings-login-password/settings-login-password.view.html',
      bindings: {
        userId: '<'
      },
      controller: SettingsLoginPasswordController
    };
    return component;
  }

  function SettingsLoginPasswordController($state, $ionicHistory, $ionicPopup,
    $translate, FirebaseService, SettingsService, VaultService) {
    var vm = this;
    var unregister;

    vm.$onInit = init;
    vm.$onDestroy = destroy;

    // internal functions

    function init() {
      unregister = FirebaseService.getAuth().onAuthStateChanged(function(user) {
        if (user) {
          vm.user = user;
          vm.back = back;
          vm.updatePassword = updatePassword;
        } else {
          $state.go('authentication');
        }
      });
    }

    function destroy() {
      unregister();
    }

    function back() {
      $ionicHistory.goBack();
    }

    function updatePassword() {
      var storedMasterCode = VaultService.getMasterCode();
      if (storedMasterCode !== vm.masterCodeInput) {
        $ionicPopup.alert({
          title: $translate.instant('errorMCTitle'),
          template: $translate.instant('errorMCMsg')
        });
      } else if (vm.newPasswordInput !== vm.newPasswordConfirmationInput) {
        $ionicPopup.alert({
          title: $translate.instant('errorNewPwdTitle'),
          template: $translate.instant('errorNewPwdMsg')
        });
      } else {
        SettingsService.updateLoginPassword(vm.user, vm.newPasswordInput)
          .then(function(result) {
          if (result === 'updated') {
            $state.go('tab.settings');
          } else {
            console.log(result);
            $ionicPopup.alert({
              title: $translate.instant('errorTitle'),
              template: result.message
            });
          }
        });
      }
    }
  }
})();
