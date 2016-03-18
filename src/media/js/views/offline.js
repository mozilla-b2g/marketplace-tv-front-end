define('views/offline',
    ['core/l10n', 'core/z', 'key_helper', 'smart_button', 'spatial_navigation'],
    function(l10n, z, keyHelper, smartButton, SpatialNavigation) {
    var gettext = l10n.gettext;

    z.page.on('loaded reloaded_chrome', function() {
        if (z.page.find('.offline-container').length) {
            SpatialNavigation.startFocus(z.page.find('.primary'));
        }
    });

    z.page.on('mouseover', '.offline-button', function() {
        this.focus();
    });

    z.page.on('keyup mouseup touchend', '.offline-button', function(e) {
        if (e.type === 'keyup' && !keyHelper.isEnterKey(e.keyCode)) {
            return;
        }

        var behavior = $(this).data('behavior');

        if (behavior === 'close') {
            window.close();
        } else if (behavior === 'try-again') {
            z.page.trigger('navigate', '/tv/');
        }
    });

    z.page.on('contextmenu', '.offline-container', function(e) {
        e.preventDefault();
    });

    return function(builder) {
        builder.start('offline.html');

        builder.z('type', 'leaf');
        builder.z('title', gettext('Offline'));
    };
});
