define('views/homepage',
    ['apps', 'core/capabilities', 'core/l10n', 'core/models', 'core/z',
     'templates', 'image_helper', 'smart_button', 'spatial_navigation'],
    function(apps, caps, l10n, models, z,
             nunjucks, imageHelper, smartButton, SpatialNavigation) {
    var gettext = l10n.gettext;
    var appsModel = models('apps');

    var $appPreview;
    var $appList;
    var $appContextMenuInstall;
    var $appContextMenuLink;

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
            $('#site-footer').html(nunjucks.env.render('footer.html'));

            $appPreview = z.page.find('.app-preview');
            $appList = z.page.find('.app-list');

            $appContextMenuInstall = z.page.find('.contextmenu-install');
            $appContextMenuLink = z.page.find('.contextmenu-link');

            $appContextMenuLink.attr({
                icon: imageHelper.getIconURL('link.png')
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

        var $appPreviewSuggested;
        var $appPreviewName;

        var appPreviewNameOverflowLength;

        // Clear the hash '#preview' when previewing apps.
        location.hash = '';

        // Reset context menu.
        $appContextMenuInstall.removeAttr('label icon')
                              .off('click');

        $appContextMenuLink.off('click');

        // Update context menu's label
        if (focusedApp.doc_type === 'webapp') {
            apps.checkInstalled(focusedManifestURL).done(function(isInstalled) {
                if (isInstalled) {
                    $appContextMenuInstall.attr('label', '#app:' + focusedManifestURL);
                } else {
                    $appContextMenuInstall.attr({
                        label: gettext('Add to Apps'),
                        icon: imageHelper.getIconURL('install.png')
                    });

                    $appContextMenuInstall.on('click', function() {
                        apps.install(focusedApp);
                    });

                    $appContextMenuLink.on('click', function() {
                        alert(focusedManifestURL);
                    });
                }
            });
        } else if (focusedApp.doc_type === 'website') {
            $appContextMenuInstall.attr('label', '#website:' +
                encodeURIComponent(focusedApp.url) + ',' +
                encodeURIComponent(focusedApp.name) + ',' +
                encodeURIComponent(findLargestIcon(focusedApp.icons)));
        }

        // Update app preview area with current focused app.
        $appPreview.html(
            nunjucks.env.render('_includes/app_preview.html', {
                app: focusedApp
            })
        );

        // Ensure suggested flag image is loaded.
        if (focusedApp.tv_featured) {
            $appPreviewSuggested = $appPreview.find('.app-preview-suggested');

            imageHelper.loadImage(
                imageHelper.getBackgroundImageURL(
                    $appPreviewSuggested.find('.flag')
                )
            ).done(function() {
                $appPreviewSuggested.removeClass('hidden');
            });
        }

        // Set app preview area name's text carousel.
        $appPreviewName = $appPreview.find('.name');

        appPreviewNameOverflowLength =
            $appPreviewName.width() - $appPreview.find('.text').width();

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

        imageHelper.loadImage(focusedApp.promo_imgs['640']).done(function() {
            $appPreview.find('.app-preview-image').removeClass('invisible');
        });
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
                ',iconUrl=' + encodeURIComponent(findLargestIcon(focusedApp.icons)));
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
