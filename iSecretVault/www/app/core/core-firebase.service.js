(function() {
  'use strict';

  angular.module('ipmApp.core.firebase.service', [
    'firebase',
    'ipmApp.core.constants'
  ])
  .service('FirebaseService', FirebaseService);

  function FirebaseService($injector, $firebaseObject) {
    var CoreConstants = $injector.get('CoreConstants');
    var fb = new Firebase(CoreConstants.FIREBASE.FIREBASE_URL);

    var self = this;
    self.getFirebaseAuth = getFirebaseAuth;
    self.getUserReference = getUserReference;
    self.getCategoryReference = getCategoryReference;
    self.getCategoriesReference = getCategoriesReference;
    self.getPasswordsReference = getPasswordsReference;
    self.getPasswordReference = getPasswordReference;
    self.synchronize = synchronize;
    self.setValue = setValue;

    // Internal functions

    function getFirebaseAuth() {
      return fb.getAuth();
    }

    function getUserReference(uid) {
      return fb.child('users/' + uid);
    }

    function getCategoriesReference(uid) {
      return fb.child('users/' + uid + '/categories');
    }

    function getCategoryReference(uid, categoryId) {
      return fb.child('users/' + uid + '/categories/' + categoryId);
    }

    function getPasswordsReference(uid, categoryId) {
      return fb.child('users/' + uid + '/categories/' + categoryId +
        '/digitalFootprints');
    }

    function getPasswordReference(uid, categoryId, digitalFootprintId) {
      return fb.child('users/' + uid + '/categories/' + categoryId +
        '/digitalFootprints/' + digitalFootprintId);
    }

    function synchronize(reference) {
      return $firebaseObject(reference);
    }

    function setValue(reference, node, value) {
      var result = reference.child(node).set(value, function() {
        return 'onComplete';
      });
      return result;
    }
  }
})();
