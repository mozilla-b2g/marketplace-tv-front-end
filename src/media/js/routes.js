define('routes',
    ['core/router'],
    function(router) {

    router.addRoutes([
        {pattern: '^/$', view_name: 'homepage'},
        {pattern: '^/index.html$', view_name: 'homepage'},
        {pattern: '^/tv/tutorial/?$', view_name: 'tutorial'},
        {pattern: '^/tv/privacy/?$', view_name: 'privacy'},
        {pattern: '^/tv/offline/?$', view_name: 'offline'},
        {pattern: '^/tv/?$', view_name: 'homepage'}
    ]);

    router.api.addRoutes({
        // TODO: Update API url after backend is ready.
        'apps': '/api/v2/tv/multi-search/',
    });

    // Processors to set query arguments on API requests.
    // router.api.addProcessor(function(endpoint) {
    //     return {something: 'to-be-in-the-query'};
    // });
});
