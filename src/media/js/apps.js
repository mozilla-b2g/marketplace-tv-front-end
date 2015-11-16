/*
    Provides the apps module, a wrapper around navigator.mozApps
*/
define('apps', ['core/defer'], function(defer) {
    'use strict';
    var installer = window.navigator.mozApps;

    function install(product) {
        installer.install(product.manifest_url);
    }

    return {
        install: install
    };
});
