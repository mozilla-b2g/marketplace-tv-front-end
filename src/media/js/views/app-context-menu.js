define('views/app-context-menu',
    ['apps', 'core/l10n', 'core/z', 'image_helper'],
    function(apps, l10n, z, imageHelper) {
    var gettext = l10n.gettext;

    var $appContextMenuInstall;
    var $appContextMenuLink;

    function resetAll() {
        $appContextMenuInstall.removeAttr('label icon').off('click');
        $appContextMenuLink.off('click');
    }

    function setWebsite(app, appIcon) {
        $appContextMenuInstall.attr('label', '#website:' +
            encodeURIComponent(app.url) + ',' +
            encodeURIComponent(app.name) + ',' +
            encodeURIComponent(appIcon));
    }

    function setAddToApps(app) {
        $appContextMenuInstall.attr({
            label: gettext('Add to Apps'),
            icon: imageHelper.getIconURL('install.png')
        });

        $appContextMenuInstall.on('click', function() {
            apps.install(app);
        });

        $appContextMenuLink.on('click', function() {
            alert(app.manifest_url);
        });
    }

    function setDeleteFromApps(app) {
        $appContextMenuInstall.attr('label', '#app:' + app.manifest_url);
    }

    z.page.on('loaded reloaded_chrome', function() {
        if (z.page.find('.app-preview').length) {
            $appContextMenuInstall = z.page.find('.contextmenu-install');
            $appContextMenuLink = z.page.find('.contextmenu-link');

            $appContextMenuLink.attr({
                icon: imageHelper.getIconURL('link.png')
            });
        }
    });

    return {
        resetAll: resetAll,
        setWebsite: setWebsite,
        setAddToApps: setAddToApps,
        setDeleteFromApps: setDeleteFromApps
    };
});
