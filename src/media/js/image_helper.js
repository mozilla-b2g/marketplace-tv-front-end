define('image_helper', ['core/defer'], function(defer) {
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
        getBackgroundImageURL: getBackgroundImageURL,
        loadImage: loadImage
    };
});
