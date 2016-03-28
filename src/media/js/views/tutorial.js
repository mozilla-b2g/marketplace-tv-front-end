define('views/tutorial',
    ['core/l10n', 'core/z',
     'key_helper', 'image_helper', 'smart_button', 'spatial_navigation'],
    function(l10n, z,
             keyHelper, imageHelper, smartButton, SpatialNavigation) {
    var gettext = l10n.gettext;

    var $spinner;

    // Ensure background image is loaded.
    function loadBackgroundImage($slide, callback) {
        var imagePromise = imageHelper.loadImage(
            imageHelper.getBackgroundImageURL($slide.find('.slide-image'))
        );

        $spinner.removeClass('hidden');

        imagePromise.done(function() {
            $spinner.addClass('hidden');
            $slide.removeClass('invisible');

            callback();
        });

        imagePromise.fail(function() {
            localStorage.setItem('marketplace.tutorial.fteskip', true);

            z.page.trigger('navigate', '/tv/');
        });
    }

    z.page.on('loaded reloaded_chrome', function() {
        if (z.page.find('.slide-container').length) {
            $spinner = z.page.find('.spinner');

            loadBackgroundImage(z.page.find('.invisible'), function() {
                SpatialNavigation.startFocus();
            });
        }
    });

    // Enable back button going back to the previous slide.
    z.page.on('keydown', function(e) {
        if (!keyHelper.isBackKey(e.keyCode)) {
            return;
        }

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
    });

    z.page.on('mouseover', '.slide-button', function(e) {
        this.focus();
    });

    z.page.on('keyup mouseup touchend', '.slide-button', function(e) {
        if (e.type === 'keyup' && !keyHelper.isEnterKey(e.keyCode)) {
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
