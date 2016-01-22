define('views/tutorial',
    ['core/l10n', 'core/z', 'smart_button', 'spatial_navigation'],
    function(l10n, z, smartButton, SpatialNavigation) {
    var gettext = l10n.gettext;

    var imageLoader = document.createElement('img');

    // Ensure background image is loaded.
    function loadBackgroundImage($slide, callback) {
        imageLoader.src = $slide.find('.slide-image')
                                .css('background-image')
                                .replace(/url\(['"]?(.*?)['"]?\)/i, '$1');

        imageLoader.onload = function() {
            $slide.removeClass('invisible');

            callback();
        };

        imageLoader.onerror = function() {
            localStorage.setItem('marketplace.tutorial.fteskip', true);

            z.page.trigger('navigate', '/tv/');
        };
    }

    z.page.on('loaded reloaded_chrome', function() {
        if (z.page.find('.tutorial-container').length) {
            var $slide = z.page.find('.invisible');

            loadBackgroundImage($slide, function() {
                SpatialNavigation.startFocus();
            });
        }
    });

    z.page.on('keyup', '.slide-button', function(e) {
        if (e.keyCode !== KeyEvent.DOM_VK_RETURN) {
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

    z.page.on('contextmenu', '.tutorial-container', function(e) {
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
