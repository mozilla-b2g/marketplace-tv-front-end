define('image_helper', ['core/defer'], function(defer) {
    function findLargestIcon(icons) {
        return icons[Math.max.apply(null, Object.keys(icons))];
    }

    function getIconURL(icon) {
        // The path of icon is different from server.
        var path = '/img/' + icon;

        // On marketplace server:
        // `media/marketplace-tv-front-end/img/{icon}.png`
        if (location.origin.match(/marketplace/)) {
            path = 'media/marketplace-tv-front-end' + path;
        }

        // On github page:
        // `/marketplace-tv-front-end/media/img/{icon}.png`
        if (location.origin.match(/github/)) {
            path = '/marketplace-tv-front-end/media' + path;
        }

        // On local server:
        // `/media/img/{icon}.png`
        if (location.origin.match(/localhost/)) {
            path = '/media' + path;
        }

        return path;
    }

    function getBackgroundImageURL($element) {
        return $element.css('background-image')
                       .replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
    }

    function loadImage(src) {
        var image = document.createElement('img');
        var def = defer.Deferred();

        image.src = src;

        image.onload = function() {
            def.resolve();
        };

        image.onerror = function() {
            def.reject();
        };

        return def.promise();
    }

    return {
        findLargestIcon: findLargestIcon,
        getIconURL: getIconURL,
        getBackgroundImageURL: getBackgroundImageURL,
        loadImage: loadImage
    };
});
