define('views/homepage',
    ['apps', 'core/capabilities', 'core/l10n', 'core/models', 'core/z',
     'templates', 'spatial-navigation'],
    function(apps, caps, l10n, models, z,
             nunjucks, SpatialNavigation) {
    var gettext = l10n.gettext;
    var appsModel = models('apps');

    // Initialize spatial navigation.
    SpatialNavigation.init();

    // Define the navigable elements.
    SpatialNavigation.add({
        selector: '.focusable'
    });

    z.page.on('loaded', function() {
        // Add 'tabindex="-1"' to "currently-existing" navigable elements.
        SpatialNavigation.makeFocusable();

        // Focus the first navigable element.
        SpatialNavigation.focus();
    });

    z.page.on('focus', '.focusable', function() {
        var $appPreview = z.page.find('.app-preview');
        var $appPreviewType;

        var focusedApp = appsModel.lookup($(this).data('slug'));
        var focusedManifestURL = focusedApp.manifest_url;

        // Update app preview area with current focused app.
        $appPreview.html(
            nunjucks.env.render('_includes/app_preview.html', {
                app: focusedApp
            })
        );

        $appPreviewType = $appPreview.find('.type');

        if (!caps.webApps) {
            $appPreviewType.removeClass('hidden');

            return;
        }

        // Update type when app is already installed.
        apps.getInstalled().done(function(installedApps) {
            installedApps.map(function(installedManifestURL) {
                if (installedManifestURL === focusedManifestURL) {
                    $appPreviewType.html('installed');
                }
            });

            $appPreviewType.removeClass('hidden');
        });
    });

    z.page.on('sn:enter-down', '.focusable', function() {
        if (!caps.webApps) {
            return;
        }

        // Preview current focused app.
        var focusedApp = appsModel.lookup($(this).data('slug'));
        var focusedManifestURL = focusedApp.manifest_url;

        apps.getInstalled().done(function(installedApps) {
            var isInstalled = false;

            // Check if app is installed.
            installedApps.map(function(installedManifestURL) {
                if (focusedManifestURL === installedManifestURL) {
                    isInstalled = true;
                }
            });

            if (isInstalled) {
                apps.launch(focusedManifestURL);
            } else {
                apps.install(focusedApp);
            }
        });
    });

    return function(builder) {
        builder.start('homepage.html');

        builder.z('type', 'root');
        builder.z('title', gettext('Homepage'));
    };
});
