/*
    Provides the apps module, a wrapper around navigator.mozApps
*/
define('apps', ['core/defer'], function(defer) {
    'use strict';
    var installer = window.navigator.mozApps;

    function getInstalled() {
        var def = defer.Deferred();
        var request = installer.getInstalled();

        request.onsuccess = function() {
            var installedApps = [];

            request.result.map(function(installedApp) {
                installedApps.push(installedApp.manifestURL);
            });

            def.resolve(installedApps);
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
        getInstalled: getInstalled,
        install: install,
        launch: launch
    };
});
