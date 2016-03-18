define('smart_button', ['core/z', 'key_helper'], function(z, keyHelper) {
    z.page.on('focus', '.focusable', function() {
        this.classList.add('focused');
    });

    z.page.on('keydown mousedown touchstart', '.focusable', function(e) {
        if (e.type === 'keydown' && !keyHelper.isEnterKey(e.keyCode)) {
            return;
        }

        e.preventDefault();

        this.classList.add('pressed');
    });

    z.page.on('keyup mouseup touchend', '.focusable', function(e) {
        if (e.type === 'keyup' && !keyHelper.isEnterKey(e.keyCode)) {
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
});
