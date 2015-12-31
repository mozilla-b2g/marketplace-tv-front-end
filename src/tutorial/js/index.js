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
    }
  });
})();
