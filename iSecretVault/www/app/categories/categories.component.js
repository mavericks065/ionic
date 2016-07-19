(function() {
  'use strict';

  angular
    .module('ipmApp.categories.component', [
      'ionic',
      'firebase',
      'ipmApp.core.firebase.service',
      'ipmApp.categories.service',
      'ionic.ion.autoListDivider'
    ])
    .component('categories', categories());

  function categories() {
    var component = {
      templateUrl: 'app/categories/categories.view.html',
      bindings: {
        masterPassword: '<'
      },
      controller: CategoriesController
    };
    return component;
  }

  function CategoriesController($scope, $state, $ionicPopup, FirebaseService,
    CategoriesService) {

    var vm = this;

    vm.$onInit = init;

    // internal functions

    function init() {
      vm.fbAuth = FirebaseService.getAuthentication();

      if (vm.fbAuth) {
        vm.userReference = FirebaseService.getUserReference(vm.fbAuth.uid);
        vm.categoriesReference = FirebaseService.getCategoriesReference(vm.fbAuth.uid);

        vm.add = add;
      } else {
        $state.go('authentication');
      }
      findAndSortCategories();
    }

    function add() {
      $ionicPopup.prompt({
        title: 'Enter a new category',
        inputType: 'text'
      }).then(function(result) {
        if (result) {
          var newCategoryReference = FirebaseService.getCategoryReference(vm.fbAuth.uid,
            result.toSHA1());

          FirebaseService.isReferenceExisting(newCategoryReference)
            .then(function(isReferenceExisting) {
              if (!isReferenceExisting) {
                CategoriesService.insertCategory(vm.categoriesReference, result);
              }
            }).then(function() {
              findAndSortCategories();
            });
        } else {
          console.log('Action not completed');
        }
      });
    }

    function findAndSortCategories() {
      vm.categories = [];

      vm.categoriesReference.on('value', function(dataSnapshot) {
        var savedCategories = dataSnapshot.val();
        for (var key in savedCategories) {
          if (savedCategories.hasOwnProperty(key)) {
            vm.categories.push({
              id: key,
              category: savedCategories[key].category
            });
          }
        }
        sortCategories();
      });
    }

    function sortCategories() {
      vm.categories = _.sortBy(vm.categories, function(category) {
        return category.category;
      });
    }
  }
})();
