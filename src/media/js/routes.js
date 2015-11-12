define('routes',
    ['core/router'],
    function(router) {

    router.addRoutes([
        {pattern: '^/$', view_name: 'hello_world'},
    ]);

    router.api.addRoutes({
        'hello-names': '/api/v2/hello/names/',
    });

    // Processors to set query arguments on API requests.
    // router.api.addProcessor(function(endpoint) {
    //     return {something: 'to-be-in-the-query'};
    // });
});
