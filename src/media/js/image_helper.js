define('image_helper', ['core/defer'], function(defer) {
    function getIconURL(icon) {
        // The path of icon is different from server.

        // On marketplace server:
        // `media/marketplace-tv-front-end/img/{icon}.png`
        var path = ['media', 'marketplace-tv-front-end', 'img', icon];

        // On github page:
        // `marketplace-tv-front-end/media/img/{icon}.png`
        if (!location.origin.match(/marketplace/)) {
            var tempPath = path[0];

            path[0] = path[1];
            path[1] = tempPath;
        }

        // On local server:
        // `/media/img/{icon}.png`
        if (location.origin.match(/localhost/)) {
            path[0] = '';
        }

        return path.join('/');
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
        getIconURL: getIconURL,
        getBackgroundImageURL: getBackgroundImageURL,
        loadImage: loadImage
    };
});
