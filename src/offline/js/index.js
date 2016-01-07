'use strict';

(function(window) {
    var $closeButton = document.getElementById('close-button');

    $closeButton.addEventListener('click', function() {
        window.close();
    });

    $closeButton.focus();
})(window);
