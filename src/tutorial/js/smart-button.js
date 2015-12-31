'use strict';
/* global KeyEvent */

(function() {
  var smartButtons = document.getElementsByClassName('smart-button');

  for (var i = 0; i < smartButtons.length; i++) {
    var smartButton = smartButtons[i];

    smartButton.addEventListener('mousedown', handleEvent);
    smartButton.addEventListener('mouseup', handleEvent);
    smartButton.addEventListener('touchstart', handleEvent);
    smartButton.addEventListener('touchend', handleEvent);
    smartButton.addEventListener('keydown', handleEvent);
    smartButton.addEventListener('keyup', handleEvent);
    smartButton.addEventListener('focus', handleEvent);
    smartButton.addEventListener('blur', handleEvent);
    smartButton.addEventListener('transitionend', handleEvent);
  }

  function handleEvent(evt) {
    switch(evt.type) {
      case 'mousedown':
      case 'touchstart':
        this.classList.add('pressed');
        break;
      case 'keydown':
        if (evt.keyCode === KeyEvent.DOM_VK_RETURN) {
          this.classList.add('pressed');
        }
        break;
      case 'mouseup':
      case 'touchend':
        this.classList.remove('pressed');
        this.classList.add('released');
        break;
      case 'keyup':
        if (evt.keyCode === KeyEvent.DOM_VK_RETURN) {
          this.classList.remove('pressed');
          this.classList.add('released');
          this.click();
        }
        break;
      case 'transitionend':
        if (this.classList.contains('released')) {
          this.classList.remove('released');
        }
        break;
      case 'focus':
        this.classList.add('focused');
        break;
      case 'blur':
        this.classList.remove('pressed');
        this.classList.remove('released');
        this.classList.remove('focused');
        break;
    }
  };
})();
