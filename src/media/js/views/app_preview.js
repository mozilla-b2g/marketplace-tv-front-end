define('views/app_preview',
    ['core/z', 'templates', 'image_helper'],
    function(z, nunjucks, imageHelper) {
    var $appPreview;
    var $appPreviewName;
    var $appPreviewText;

    var CAROUSEL_WAITING_TIME = 3000;

    function renderPreview(app) {
        $appPreview.html(
            nunjucks.env.render('_includes/app_preview.html', { app: app })
        );

        $appPreviewName = $appPreview.find('.name');
        $appPreviewText = $appPreview.find('.text');

        if (app.tv_featured) {
            setSuggestedFlag();
        }

        setTextCarousel();

        setPreviewImage(app.promo_imgs['640'] ||
                        app.promo_imgs['320']);
    }

    function setSuggestedFlag() {
        var $appPreviewSuggested = $appPreview.find('.app-preview-suggested');

        // Ensure suggested flag image is loaded.
        imageHelper.loadImage(
            imageHelper.getBackgroundImageURL(
                $appPreviewSuggested.find('.flag')
            )
        ).done(function() {
            $appPreviewSuggested.removeClass('hidden');
        });
    }

    // Recursively calling this function to make the carousel effect.
    function setTextCarousel() {
        var appPreviewNameOverflowLength =
            $appPreviewText.width() - $appPreviewName.width();

        if (appPreviewNameOverflowLength < 0) {
            return;
        }

        setTextCarouselTimeout($appPreviewName, function() {
            setPreviewNameIndent(appPreviewNameOverflowLength + 5);
        });
    };

    function setTextCarouselTimeout($currentPreviewName, callback) {
        setTimeout(function() {
            // Check if we are still previewing the same app.
            // If not, the recursive stops.
            if ($appPreview.has($currentPreviewName).length === 0) {
                return;
            }

            callback();
        }, CAROUSEL_WAITING_TIME);
    }

    function setPreviewNameIndent(indentLength) {
        if (indentLength > 0) {
            // Transition duration will be decided by how much the length
            // exceed.
            var duration = indentLength * 8;

            // Move the text smoothly with text indent transition.
            // Text overflow will temporary been unset since its harder to read
            // with ellipsis when the text is moving.
            $appPreviewName.css({
                'text-indent': -indentLength,
                'transition-property': 'text-indent',
                'transition-duration': (duration / 1000) + 's',
                'transition-timing-function': 'linear',
                'text-overflow': 'unset'
            });
        } else {
            // Go back directly to the begin of the text without transition.
            $appPreviewName.css({
                'text-indent': indentLength,
                'transition': 'none',
                'text-overflow': 'ellipsis'
            });
        }
    }

    function setPreviewImage(image) {
        imageHelper.loadImage(image).done(function() {
            $appPreview.find('.app-preview-image').removeClass('invisible');
        });
    }

    z.page.on('loaded reloaded_chrome', function() {
        if (z.page.find('.app-preview').length) {
            $appPreview = z.page.find('.app-preview');
        }
    });

    z.page.on('transitionend', '.app-preview .name', function() {
        setTextCarouselTimeout($appPreviewName, function() {
            setPreviewNameIndent(0);
            setTextCarousel();
        });
    });

    return {
        render: renderPreview
    };
});
