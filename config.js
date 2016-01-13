/* Configures component and module upgrade paths. */
var config = require('commonplace').config;
var extend = require('node.extend');

var LIB_DEST_PATH = config.LIB_DEST_PATH;

var localConfig = extend(true, {
    bowerConfig: {
        // Bower configuration for which files to get, and where to put them.
        // [Source, excluding bower_components]: [Destination].
        // 'isotope/dist/isotope.pkgd.js': config.LIB_DEST_PATH,
        'normalize.css/normalize.css': 'src/media/css/',
        'js-spatial-navigation/spatial_navigation.js': 'src/media/js/lib/'
    },
    cssBundles: {
        // Arbitrary CSS bundles to create.
        // The key is the bundle name, which'll be excluded from the CSS build.
        // 'splash.css': ['splash.styl.css']
    },
    cssExcludes: [
        // List of CSS filenames to exclude from CSS build.
        // splash.styl.css
    ],
    requireConfig: {
        // RequireJS configuration for development, notably files in lib/.
        // [Module name]: [Module path].
        paths: {
            // 'isotope': 'lib/isotope.pkgd',
            'lib/spatial_navigation': 'lib/spatial_navigation'
        },
        shim: {
            // 'underscore': { 'exports': '_' }
            'lib/spatial_navigation': { 'exports': 'SpatialNavigation' }
        }
    },
    PORT: 8674,
    packageConfig: {
        'prod': {
            domain: 'https://marketplace.firefox.com',
            media_url: 'https://marketplace.cdn.mozilla.net/media/',
            name: 'Web Apps',
            origin: 'app://marketplace.firefox.com'
        },
        'dev': {
            domain: 'https://marketplace-dev.allizom.org',
            media_url: 'https://marketplace-dev.mozflare.net/media/',
            name: 'Dev',
            origin: 'app://marketplace-dev.allizom.org'
        },
        'stage': {
            domain: 'https://marketplace.allizom.org',
            media_url: 'https://marketplace-stage.cdn.mozilla.net/media/',
            name: 'Stage',
            origin: 'app://marketplace.allizom.org'
        }
    }
}, config);

localConfig.inlineRequireConfig = config.makeInlineRequireConfig(
    localConfig.requireConfig);

module.exports = localConfig;
