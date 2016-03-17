define('footer',
    ['core/z', 'templates', 'smart_button'],
    function(z, nunjucks, smartButton) {
    var $footer;
    var $footerLink;

    function renderFooter(template, data) {
        $footer = $footer || $('#site-footer');

        if (template) {
            $footer.html(nunjucks.env.render(template, data));

            $footerLink = $footer.find('.footer-link');
        } else {
            $footer.html('');

            $footerLink = null;
        }
    }

    z.page.on('loaded reloaded_chrome', function() {
        if (z.page.find('.app-preview').length) {
            renderFooter('_includes/footer.html');

            $footerLink.on('mouseover', function() {
                this.focus();
            });
        } else {
            if ($footerLink) {
                $footerLink.off('mouseover');
            }

            renderFooter('');
        }
    });

    return {
        render: renderFooter
    };
});
