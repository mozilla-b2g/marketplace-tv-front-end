define('views/homepage',
    ['apps', 'core/capabilities', 'core/l10n', 'core/models', 'core/z',
     'smart_button', 'spatial_navigation',
     'views/app-preview', 'views/app-context-menu'],
    function(apps, caps, l10n, models, z,
             smartButton, SpatialNavigation,
             appPreview, appContextMenu) {
    var gettext = l10n.gettext;
    var appsModel = models('apps');

    var $appList;

    function findLargestIcon(icons) {
        var iconSizes = Object.keys(icons);
        var maxIconSize = iconSizes.reduce(function(prev, current) {
            return parseInt(prev, 10) < parseInt(current, 10) ? current : prev;
        });

        return icons[maxIconSize];
    }

    // Prevent back button so the website will not go back to the tutorial page.
    window.addEventListener('keydown', function(e) {
        if (e.keyCode === window.KeyEvent.DOM_VK_BACK_SPACE ||
            e.key === 'Backspace') {
            if (z.page.find('.app-preview').length) {
                e.preventDefault();
            }
        }
    });

    z.page.on('loaded reloaded_chrome', function() {
        if (z.page.find('.app-preview').length) {
            $appList = z.page.find('.app-list');

            SpatialNavigation.add({
                selector: '.footer-link'
            });

            SpatialNavigation.startFocus();
        }
    });

    z.page.on('sn:willfocus', '.app-button', function() {
        SpatialNavigation.pause();

        var callback = function() {
            SpatialNavigation.focus(this);
            SpatialNavigation.resume();
        };

        var appListScrollTop = $appList.scrollTop();
        var appListHeight = $appList.innerHeight();

        var top = this.offsetTop;
        var height = this.offsetHeight;
        var margin = 5.8 * 10;

        var appTop = top - margin;
        var appBottom = top + height + margin - appListHeight;
        var appHeight = height + margin * 2;

        var newPosition;

        if (appListHeight < appHeight) {
            // Current scope height is too narrow.
            // Scroll to the center of the app.
            newPosition = appTop + (appHeight - appListHeight) / 2;
        } else if (appListScrollTop >= appTop) {
            // App is above current scope.
            newPosition = appTop;
        } else if (appListScrollTop < appBottom) {
            // App is below current scope.
            newPosition = appBottom;
        }

        if (newPosition) {
            $appList.animate({ scrollTop: newPosition }, {
                duration: 200,
                done: callback.bind(this)
            });
        } else {
            callback.call(this);
        }

        return false;
    });

    z.page.on('focus', '.app-button', function() {
        var focusedApp = appsModel.lookup(this.dataset.id);
        var focusedManifestURL = focusedApp.manifest_url;

        // Clear the hash '#preview' when previewing apps.
        location.hash = '';

        // Reset context menu.
        appContextMenu.resetAll();

        // Update context menu's label
        if (focusedApp.doc_type === 'webapp') {
            apps.checkInstalled(focusedManifestURL).done(function(isInstalled) {
                if (isInstalled) {
                    appContextMenu.setDeleteFromApps(focusedApp);
                } else {
                    appContextMenu.setAddToApps(focusedApp);
                }
            });
        } else if (focusedApp.doc_type === 'website') {
            appContextMenu.setWebsite(
                focusedApp, findLargestIcon(focusedApp.icons));
        }

        // Update app preview area with current focused app.
        appPreview.render(focusedApp);
    });

    z.page.on('keyup', '.app-button', function(e) {
        if (e.keyCode !== window.KeyEvent.DOM_VK_RETURN || !caps.webApps) {
            return;
        }

        // Preview current focused app.
        var focusedApp = appsModel.lookup(this.dataset.id);

        if (focusedApp.doc_type === 'webapp') {
            var focusedManifestURL = focusedApp.manifest_url;

            apps.checkInstalled(focusedManifestURL).done(function(isInstalled) {
                if (isInstalled) {
                    apps.launch(focusedManifestURL);
                } else {
                    location.hash = 'preview';

                    apps.install(focusedApp);
                }
            });
        } else {
            window.open(focusedApp.url, '_blank',
                'remote=true,preview=true' +
                ',name=' + encodeURIComponent(focusedApp.name) +
                ',iconUrl=' + encodeURIComponent(
                    findLargestIcon(focusedApp.icons)
                )
            );
        }
    });

    return function(builder) {
        if (!localStorage.getItem('marketplace.tutorial.fteskip')) {
             z.page.trigger('navigate', '/tv/tutorial/');

             return;
        }

        builder.start('homepage.html');

        builder.z('type', 'root');
        builder.z('title', gettext('Homepage'));

        builder.onload('app-list').fail(function() {
            z.page.trigger('navigate', '/tv/offline/');
        });
    };
});
