'use strict';

angular.module('copayApp.controllers').controller('disclaimerController', function($scope, $log, uxLanguage, profileService, go) {
  this.lang = uxLanguage.currentLanguage;
  this.acceptInProgress = false;

  this.accept = function() {
  	this.acceptInProgress = true;
    profileService.setDisclaimerAccepted(function(err) {
      if (err) $log.error(err);
      else go.walletHome();
    });
  };

});
