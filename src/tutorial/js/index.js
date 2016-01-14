'use strict';
/* global FTEWizard */

(function() {
  var tutorial = new FTEWizard('marketplace.tutorial');

  tutorial.init({
    container: document.getElementById('tutorial-container'),
    pageClass: 'slide',
    buttonsClass: 'slide-button',
    propagateKeyEvent: true,
    onfinish: function() {
      location.href = '../index.html';
    },
    onPageChange: function (currentPage) {
      switch (currentPage.id) {
        case 'slide-2':
          this._simpleKeyNavigation.focusOn(
            document.querySelector(
              '#slide-2 .slide-button[data-behavior="next"]')
          );
          break;

        case 'slide-3':
          this._simpleKeyNavigation.focusOn(
            document.querySelector(
              '#slide-3 .slide-button[data-behavior="finish"]')
          );
          break;
      }
    }
  });

  window.oncontextmenu = function() {
    return false;
  };
})();
