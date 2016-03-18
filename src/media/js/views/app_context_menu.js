define('views/app_context_menu',
    ['apps', 'core/l10n', 'core/z', 'image_helper'],
    function(apps, l10n, z, imageHelper) {
    var gettext = l10n.gettext;

    var $appContextMenuInstall;
    var $appContextMenuLink;

    function setContextMenu(app) {
        // Reset context menu.
        resetContextMenu();

        // Update context menu's label
        if (app.doc_type === 'webapp') {
            apps.checkInstalled(app.manifest_url).done(function(isInstalled) {
                if (isInstalled) {
                    setDeleteFromApps(app);
                } else {
                    setAddToApps(app);
                }
            });
        } else if (app.doc_type === 'website') {
            setWebsite(app);
        }
    }

    function resetContextMenu() {
        $appContextMenuInstall.removeAttr('label icon').off('click');
        $appContextMenuLink.off('click');
    }

    function setWebsite(app) {
        $appContextMenuInstall.attr('label', '#website:' +
            [app.url, app.name, imageHelper.findLargestIcon(app.icons)]
                .map(function(item) {
                    return encodeURIComponent(item);
                }).join(','));
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
        set: setContextMenu
    };
});
