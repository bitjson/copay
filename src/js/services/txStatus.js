'use strict';

angular.module('copayApp.services').factory('txStatus', function($ionicModal, lodash, $timeout, txFormatService, isCordova) {
  var root = {};

  root.notify = function($scope, fc, txp, cb) {
    var status = txp.status;
    var type;
    var INMEDIATE_SECS = 10;

    if (status == 'broadcasted') {
      type = 'broadcasted';
    } else {

      var n = txp.actions.length;
      var action = lodash.find(txp.actions, {
        copayerId: fc.credentials.copayerId
      });

      if (!action)  {
        type = 'created';
      } else if (action.type == 'accept') {
        // created and accepted at the same time?
        if ( n == 1 && action.createdOn - txp.createdOn < INMEDIATE_SECS ) {
          type = 'created';
        } else {
          type = 'accepted';
        }
      } else if (action.type == 'reject') {
        type = 'rejected';
      } else {
        throw new Error('Unknown type:' + type);
      }
    }

    openModal($scope, type, txp, cb);
  };

  var openModal = function($scope, type, txp, cb) {
    $scope.type = type;
    $scope.tx = txFormatService.processTx(txp);
    $scope.cb = cb;

    $ionicModal.fromTemplateUrl('views/modals/tx-status.html', {
      scope: $scope,
      backdropClickToClose: false,
      hardwareBackButtonClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.txStatusModal = modal;
      $scope.txStatusModal.show();
    });
  };

  return root;
});
