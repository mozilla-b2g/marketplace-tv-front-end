define('footer', ['core/z', 'templates'], function(z, nunjucks) {
    var $footer;

    function renderFooter(template, data) {
        $footer = $footer || $('#site-footer');

        if (template) {
            $footer.html(nunjucks.env.render(template, data));
        } else {
            $footer.html('');
        }
    }

    z.page.on('loaded reloaded_chrome', function() {
        if (z.page.find('.app-preview').length) {
            renderFooter('footer.html');
        } else {
            renderFooter('');
        }
    });

    return {
        render: renderFooter
    };
});
