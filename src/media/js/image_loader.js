define('image_loader', ['core/defer'], function(defer) {
    var imageLoader = document.createElement('img');

    function getImage(src) {
        var def = defer.Deferred();

        imageLoader.src = src;

        imageLoader.onload = function() {
            def.resolve();
        };

        imageLoader.onerror = function() {
            def.reject();
        };

        return def.promise();
    }

    return {
        getImage: getImage
    };
});
