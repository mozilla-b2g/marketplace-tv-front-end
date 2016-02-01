define('views/tutorial',
    ['core/l10n', 'core/z', 'image_loader', 'smart_button', 'spatial_navigation'],
    function(l10n, z, imageLoader, smartButton, SpatialNavigation) {
    var gettext = l10n.gettext;

    // Ensure background image is loaded.
    function loadBackgroundImage($slide, callback) {
        var imageSrc = $slide.find('.slide-image')
                             .css('background-image')
                             .replace(/url\(['"]?(.*?)['"]?\)/i, '$1');

        var imagePromise = imageLoader.getImage(imageSrc);

        imagePromise.done(function() {
            $slide.removeClass('invisible');

            callback();
        });

        imagePromise.fail(function() {
            localStorage.setItem('marketplace.tutorial.fteskip', true);

            z.page.trigger('navigate', '/tv/');
        });
    }

    // Enable back button going back to the previous slide.
    window.addEventListener('keydown', function(e) {
        if (e.keyCode === window.KeyEvent.DOM_VK_BACK_SPACE ||
            e.key === 'Backspace') {
            if (z.page.find('.slide-container').length) {
                e.preventDefault();

                var $slide = z.page.find('.slide').not('.hidden');
                var $prevSlide = $slide.prev();

                if ($prevSlide.length) {
                    $slide.addClass('hidden');
                    $prevSlide.addClass('invisible')
                              .removeClass('hidden');

                    loadBackgroundImage($prevSlide, function() {
                        SpatialNavigation.focus($prevSlide.find('.primary'));
                    });
                }
            }
        }
    });

    z.page.on('loaded reloaded_chrome', function() {
        if (z.page.find('.slide-container').length) {
            var $slide = z.page.find('.invisible');

            loadBackgroundImage($slide, function() {
                SpatialNavigation.startFocus();
            });
        }
    });

    z.page.on('keyup', '.slide-button', function(e) {
        if (e.keyCode !== window.KeyEvent.DOM_VK_RETURN) {
            return;
        }

        var behavior = $(this).data('behavior');
        var $slide = $(this).closest('.slide');

        if (behavior === 'prev') {
            var $prevSlide = $slide.prev();

            $slide.addClass('hidden');
            $prevSlide.addClass('invisible')
                      .removeClass('hidden');

            loadBackgroundImage($prevSlide, function() {
                SpatialNavigation.focus($prevSlide.find('.primary'));
            });
        } else if (behavior === 'next') {
            var $nextSlide = $slide.next();

            $slide.addClass('hidden');
            $nextSlide.addClass('invisible')
                      .removeClass('hidden');

            loadBackgroundImage($nextSlide, function() {
                SpatialNavigation.focus($nextSlide.find('.primary'));
            });
        } else if (behavior === 'finish') {
            $slide.addClass('hidden');

            localStorage.setItem('marketplace.tutorial.fteskip', true);

            z.page.trigger('navigate', '/tv/');
        }
    });

    z.page.on('contextmenu', '.slide-container', function(e) {
        e.preventDefault();
    });

    return function(builder) {
        if (localStorage.getItem('marketplace.tutorial.fteskip')) {
             z.page.trigger('navigate', '/tv/');

             return;
        }

        builder.start('tutorial.html');

        builder.z('type', 'leaf');
        builder.z('title', gettext('Tutorial'));
    };
});
