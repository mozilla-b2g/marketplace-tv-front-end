define('views/homepage',
    ['apps', 'core/capabilities', 'core/l10n', 'core/models', 'core/z',
     'templates', 'spatial-navigation'],
    function(apps, caps, l10n, models, z,
             nunjucks, SpatialNavigation) {
    var gettext = l10n.gettext;
    var appsModel = models('apps');

    var appContextMenu = document.getElementById('contextmenu').children[0];

    var $appPreview;
    var $appList;

    var appListHeight;

    function findLargestIcon(icons) {
        var iconSizes = Object.keys(icons);
        var maxIconSize = iconSizes.reduce(function(prev, current) {
            return parseInt(prev, 10) < parseInt(current, 10) ? current : prev;
        });

        return icons[maxIconSize];
    }

    // Initialize spatial navigation.
    SpatialNavigation.init();

    // Define the navigable elements.
    SpatialNavigation.add({
        selector: '.focusable'
    });

    z.page.on('loaded', function() {
        $appPreview = z.page.find('.app-preview');
        $appList = z.page.find('.app-list');

        appListHeight = $appList.innerHeight();

        // Add 'tabindex="-1"' to "currently-existing" navigable elements.
        SpatialNavigation.makeFocusable();

        // Focus the first navigable element.
        SpatialNavigation.focus();
    });

    z.page.on('sn:willfocus', '.focusable', function() {
        SpatialNavigation.pause();

        var callback = function() {
            SpatialNavigation.focus(this);
            SpatialNavigation.resume();
        };

        var scrollTop = $appList.scrollTop();
        var top = this.offsetTop;
        var bottom = top + this.offsetHeight;
        var margin = 5.8 * 10;
        var newPosition;

        if (scrollTop > top - margin) {
            newPosition = top - margin;
        } else if (scrollTop < bottom + margin - appListHeight) {
            newPosition = bottom + margin - appListHeight;
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

    z.page.on('focus', '.focusable', function() {
        var focusedApp = appsModel.lookup(this.dataset.slug);
        var focusedManifestURL = focusedApp.manifest_url;

        var $appPreviewName;
        var $appPreviewNameText;
        var $appPreviewPrice;

        var appPreviewNameOverflowLength;

        // Update context menu's label
        if (focusedApp.doc_type === 'webapp') {
            appContextMenu.label = '#app:' + focusedManifestURL;
        } else if (focusedApp.doc_type === 'website') {
            appContextMenu.label = '#website:' +
                                    encodeURIComponent(focusedApp.url) + ',' +
                                    encodeURIComponent(focusedApp.name) + ',' +
                                    encodeURIComponent(findLargestIcon(focusedApp.icons));
        } else {
            appContextMenu.label = '';
        }

        this.classList.add('focused');

        // Update app preview area with current focused app.
        $appPreview.html(
            nunjucks.env.render('_includes/app_preview.html', {
                app: focusedApp
            })
        );

        $appPreviewName = $appPreview.find('.name');
        $appPreviewNameText = $appPreview.find('.text');
        $appPreviewPrice = $appPreview.find('.price');

        // Set app preview area name's text carousel.
        appPreviewNameOverflowLength =
            $appPreviewName.width() - $appPreviewNameText.width();

        if (appPreviewNameOverflowLength < 0) {
            // Save space for italic font style.
            appPreviewNameOverflowLength -= 5;

            // Recursively calling this function to make the carousel effect.
            var carousel = function(delay) {
                // Delay time will be 0 if there is no transition duration is given.
                delay = delay || 0;

                // Check if we are still previewing the same app.
                // If not, the recursive stops.
                if ($appPreview.has($appPreviewName).length) {
                    // Default waiting time is 3 sec, so the total waiting time
                    // will be transition duration plus 3 sec.
                    setTimeout(function() {
                        // Check if the text has been indented or not.
                        var appPreviewNameIndentLength =
                            parseInt($appPreviewName.css('text-indent'));

                        if (appPreviewNameIndentLength < 0) {
                            // Go back directly to the begin of the text without transition.
                            $appPreviewName.css({
                                'text-indent': 0,
                                'transition': 'none',
                                'text-overflow': 'ellipsis'
                            });

                            // No transition duration.
                            carousel();
                        } else {
                            // Transition duration will be decided by how much the length exceed.
                            var duration = appPreviewNameOverflowLength * -8;

                            // Move the text smoothly with text indent transition.
                            // Text overflow will temporary been unset since its
                            // harder to read with ellipsis when the text is moving.
                            $appPreviewName.css({
                                'text-indent': appPreviewNameOverflowLength,
                                'transition-property': 'text-indent',
                                'transition-duration': (duration / 1000) + 's',
                                'transition-timing-function': 'linear',
                                'text-overflow': 'unset'
                            });

                            // Transition duration should be added to the next waiting time.
                            carousel(duration);
                        }
                    }, delay + 3000);
                }
            };

            // Starts the carousel. Will wait for 3 sec at the first time before starting.
            carousel();
        }

        $appPreviewPrice.removeClass('hidden');
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

        if (e.type === 'keyup') {
            if (!caps.webApps) {
                return;
            }

            // Preview current focused app.
            var focusedApp = appsModel.lookup(this.dataset.slug);

            if (focusedApp.doc_type === 'webapp') {
                var focusedManifestURL = focusedApp.manifest_url;

                apps.getInstalled().done(function(installedApps) {
                    // Check if app is installed.
                    var isInstalled = installedApps.some(function(installedManifestURL) {
                        return focusedManifestURL === installedManifestURL;
                    });

                    if (isInstalled) {
                        apps.launch(focusedManifestURL);
                    } else {
                        apps.install(focusedApp);
                    }
                });
            } else {
                window.open(focusedApp.url, '_blank',
                    'remote=true,preview=true' +
                    ',name=' + encodeURIComponent(focusedApp.name) +
                    ',iconUrl=' + encodeURIComponent(findLargestIcon(focusedApp.icons)));
            }
        }
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

    return function(builder) {
        builder.start('homepage.html');

        builder.z('type', 'root');
        builder.z('title', gettext('Homepage'));
    };
});
