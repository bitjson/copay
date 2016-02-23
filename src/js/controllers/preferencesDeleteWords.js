'use strict';

angular.module('copayApp.controllers').controller('preferencesDeleteWordsController',
  function($scope, confirmDialog, notification, profileService, go, gettextCatalog, isCordova, $ionicModal) {
    var self = this;
    var fc = profileService.focusedClient;
    var delete_msg = gettextCatalog.getString('Are you sure you want to delete the backup words?');
    var accept_msg = gettextCatalog.getString('Accept');
    var cancel_msg = gettextCatalog.getString('Cancel');
    var confirm_msg = gettextCatalog.getString('Confirm');
    var success_msg = gettextCatalog.getString('Backup words deleted');

    self.deleted = (fc.credentials && !fc.credentials.mnemonicEncrypted && !fc.credentials.mnemonic);

    var _modalDeleteWords = function() {
      $scope.title = delete_msg;
      $scope.accept_msg = accept_msg;
      $scope.cancel_msg = cancel_msg;
      $scope.confirm_msg = confirm_msg;
      $scope.okAction = _deleteWords;
      $scope.loading = false;

      $ionicModal.fromTemplateUrl('views/modals/confirmation.html', {
        scope: $scope,
        backdropClickToClose: false,
        hardwareBackButtonClose: false,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.confirmationModal = modal;
        $scope.confirmationModal.show();
      });
    };

    var _deleteWords = function() {
      fc.clearMnemonic();
      profileService.updateCredentialsFC(function() {
        notification.success(
          gettextCatalog.getString('Success'),
          gettextCatalog.getString(success_msg, {walletName: walletName}),
          {color: themeService.getPublishedSkin().view.primaryColor,
           iconColor: themeService.getPublishedTheme().view.notificationBarIconColor,
           barBackground: themeService.getPublishedTheme().view.notificationBarBackground});
        go.walletHome();
      });
    };

    this.delete = function() {
      if (isCordova) {
        navigator.notification.confirm(
          delete_msg,
          function(buttonIndex) {
            if (buttonIndex == 1) {
              _deleteWords();
            }
          },
          confirm_msg, [accept_msg, cancel_msg]
        );
      } else {
        _modalDeleteWords();
      }
    };

  });
