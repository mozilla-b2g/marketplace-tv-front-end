define('smart_button', ['core/z'], function(z) {
    z.page.on('focus', '.focusable', function() {
        this.classList.add('focused');
    });

    z.page.on('keydown mousedown touchstart', '.focusable', function(e) {
        if (e.type === 'keydown' && e.keyCode !== KeyEvent.DOM_VK_RETURN) {
            return;
        }

        this.classList.add('pressed');
    });

    z.page.on('keyup mouseup touchend', '.focusable', function(e) {
        if (e.type === 'keyup' && e.keyCode !== KeyEvent.DOM_VK_RETURN) {
            return;
        }

        this.classList.remove('pressed');
        this.classList.add('released');
    });

    z.page.on('transitionend', '.focusable', function() {
        if (this.classList.contains('released')) {
            this.classList.remove('released');
        }
    });

    z.page.on('blur', '.focusable', function() {
        this.classList.remove('focused');
        this.classList.remove('pressed');
        this.classList.remove('released');
    });

    return {};
});
