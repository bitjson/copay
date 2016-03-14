'use strict';

angular.module('copayApp.controllers').controller('txSearchController', function($scope, $rootScope, $timeout, isCordova, lodash, txHistoryService, addressbookService) {

  var self = this;
  var home = $scope.self;

  txHistoryService.txHistorySearchResults = [];
  txHistoryService.nextTxHistory = txHistoryService.historyShowMoreLimit;

  self.startSearch = function() {
    $scope.search = '';
    self.result = [];
    self.addressbook = self.getAddressbook();
    txHistoryService.historyShowMore = false;
  };

  self.cancelSearch = function() {
    self.result = [];
    txHistoryService.nextTxHistory = 0;
  }

  $scope.cancel = function() {
    self.cancelSearch();
    $scope.txSearchModal.hide();
    $scope.txSearchModal.remove();
  };

  $scope.historyShowMore = function()
  {
    return txHistoryService.historyShowMore;
  };

  $scope.showMore = function() {
    $timeout(function() {
      txHistoryService.showMore();
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, 300); // Allow the infinte scroll spinner some display time
  };

  $scope.updateSearchInput = function(search) {
    $scope.search = search;
    if (isCordova)
      window.plugins.toast.hide();
    self.throttleSearch();
  }

  self.getAddressbook = function() {
    addressbookService.list(function(err, ab) {
      if (err) {
        $log.error('Error getting the addressbook');
        return;
      }
      return ab;
    });
  };

  self.throttleSearch = lodash.throttle(function() {

    function filter(search) {
      self.result = [];

      function computeSearchableString(tx) {
        var addrbook = '';
        if (tx.addressTo && self.addressbook && self.addressbook[tx.addressTo]) addrbook = self.addressbook[tx.addressTo] || '';
        var searchableDate = computeSearchableDate(new Date(tx.time * 1000));
        var message = tx.message ? tx.message : '';
        var addressTo = tx.addressTo ? tx.addressTo : '';
        return ((tx.amountStr + message + addressTo + addrbook + searchableDate).toString()).toLowerCase();
      }

      function computeSearchableDate(date) {
        var day = ('0' + date.getDate()).slice(-2).toString();
        var month = ('0' + (date.getMonth() + 1)).slice(-2).toString();
        var year = date.getFullYear();
        return [month, day, year].join('/');
      };

      if (lodash.isEmpty(search)) {
        txHistoryService.historyShowMore = false;
        return [];
      }
      self.result = lodash.filter(txHistoryService.completeHistory, function(tx) {
        if (!tx.searcheableString) tx.searcheableString = computeSearchableString(tx);
        return lodash.includes(tx.searcheableString, search.toLowerCase());
      });

      txHistoryService.historyShowMore = (self.result.length > txHistoryService.historyShowLimit);
      return self.result;
    };

    txHistoryService.txHistorySearchResults = filter($scope.search).slice(0, txHistoryService.historyShowLimit);
    if (isCordova)
      window.plugins.toast.showShortBottom(gettextCatalog.getString('Matches: ' + self.result.length));

    $timeout(function() {
      $rootScope.$apply();
    });

  }, 1000);

  self.startSearch();

});