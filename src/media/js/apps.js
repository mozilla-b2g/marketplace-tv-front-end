/*
    Provides the apps module, a wrapper around navigator.mozApps
*/
define('apps', ['core/defer'], function(defer) {
    'use strict';
    var installer = window.navigator.mozApps;

    function checkInstalled(manifestURL) {
        var def = defer.Deferred();
        var request = installer.getInstalled();

        request.onsuccess = function() {
            var isInstalled = request.result.some(function(installedApp) {
                return manifestURL === installedApp.manifestURL;
            });

            def.resolve(isInstalled);
        };

        return def.promise();
    }

    function install(product) {
        installer.install(product.manifest_url);
    }

    function launch(manifestURL) {
        var request = installer.getInstalled();

        request.onsuccess = function() {
            request.result.map(function(installedApp) {
                if (manifestURL === installedApp.manifestURL) {
                    installedApp.launch();
                }
            });
        };
    }

    return {
        checkInstalled: checkInstalled,
        install: install,
        launch: launch
    };
});
