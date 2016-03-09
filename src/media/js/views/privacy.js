define('views/privacy',
    ['core/l10n', 'core/z', 'smart_button', 'spatial_navigation', 'scrollable'],
    function(l10n, z, smartButton, SpatialNavigation, Scrollable) {
    var gettext = l10n.gettext;

    var $privacyContent;
    var $privacyContentLink;

    var hasFocused;
    var focusedIndex;

    var scrollable = new Scrollable();

    z.page.on('loaded reloaded_chrome', function() {
        if (z.page.find('.privacy-container').length) {
            $('#site-footer').html('');

            // Prevent the keyup event of enter key from previous page.
            hasFocused = false;

            // Reset the focus index.
            focusedIndex = 0;

            $privacyContent = z.page.find('.privacy-content');
            $privacyContentLink = $privacyContent.find('a');

            // Make privacy-content scrollable.
            scrollable.init($privacyContent);

            SpatialNavigation.add({
                selector: '.privacy-content'
            });

            SpatialNavigation.startFocus(z.page.find('.primary'));
        }
    });

    z.page.on('sn:willfocus', '.privacy-button', function() {
        $privacyContentLink.removeClass('focused');
    });

    z.page.on('transitionend', '.privacy-button', function() {
        if (!hasFocused && !this.classList.contains('pressed')) {
            hasFocused = true;
        }
    });

    z.page.on('keyup', '.privacy-button', function(e) {
        if (e.keyCode !== window.KeyEvent.DOM_VK_RETURN) {
            return;
        }

        if (hasFocused) {
            z.page.trigger('navigate', '/tv/');
        } else {
            hasFocused = true;
        }
    });

    z.page.on('sn:willfocus', '.privacy-content', function() {
        var linkTop = $privacyContentLink.eq(focusedIndex).position().top;

        if (linkTop >= 0 && linkTop < $privacyContent.height()) {
            $privacyContentLink.eq(focusedIndex).addClass('focused');
        }

        SpatialNavigation.pause();
    });

    z.page.on('keydown', '.privacy-content', function(e) {
        if (e.keyCode !== window.KeyEvent.DOM_VK_UP &&
            e.keyCode !== window.KeyEvent.DOM_VK_LEFT &&
            e.keyCode !== window.KeyEvent.DOM_VK_DOWN &&
            e.keyCode !== window.KeyEvent.DOM_VK_RIGHT) {
            return;
        }

        var contentHeight = $privacyContent.height();
        var linkTop = $privacyContentLink.eq(focusedIndex).position().top;
        var linkFocused = $privacyContentLink.eq(focusedIndex)
                                             .hasClass('focused');

        if (e.keyCode === window.KeyEvent.DOM_VK_UP ||
            e.keyCode === window.KeyEvent.DOM_VK_LEFT) {
            if (linkFocused &&
                linkTop + scrollable.SCROLL_OFFSET > contentHeight) {
                // Unfocus when link is out of scrolling viewport.
                $privacyContentLink.eq(focusedIndex).removeClass('focused');
            }

            if (!linkFocused &&
                linkTop + scrollable.SCROLL_OFFSET >= 0 &&
                linkTop + scrollable.SCROLL_OFFSET < contentHeight) {
                $privacyContentLink.eq(focusedIndex).addClass('focused');
            } else if (focusedIndex > 0) {
                // Focus previous link if it is inside scrolling viewport.
                var prevLinkTop = $privacyContentLink.eq(focusedIndex - 1)
                                                     .position().top;

                if (prevLinkTop + scrollable.SCROLL_OFFSET >= 0) {
                    $privacyContentLink.removeClass('focused')
                                       .eq(--focusedIndex).addClass('focused');

                    if (prevLinkTop >= 0) {
                        return;
                    }
                }
            }

            if (scrollable.getScrollTop() === 0) {
                return;
            }
        }

        if (e.keyCode === window.KeyEvent.DOM_VK_DOWN ||
            e.keyCode === window.KeyEvent.DOM_VK_RIGHT) {
            if (linkFocused &&
                linkTop - scrollable.SCROLL_OFFSET < 0) {
                // Unfocus when link is out of scrolling viewport.
                $privacyContentLink.eq(focusedIndex).removeClass('focused');
            }

            if (!linkFocused &&
                linkTop - scrollable.SCROLL_OFFSET >= 0 &&
                linkTop - scrollable.SCROLL_OFFSET < contentHeight) {
                $privacyContentLink.eq(focusedIndex).addClass('focused');
            } else if (focusedIndex < $privacyContentLink.length - 1) {
                // Focus next link if it is inside scrolling viewport.
                var nextLinkTop = $privacyContentLink.eq(focusedIndex + 1)
                                                     .position().top;

                if (nextLinkTop - scrollable.SCROLL_OFFSET < contentHeight) {
                    $privacyContentLink.removeClass('focused')
                                       .eq(++focusedIndex).addClass('focused');

                    if (nextLinkTop < contentHeight) {
                        return;
                    }
                }
            }

            if (scrollable.getScrollTop() === scrollable.getScrollHeight()) {
                SpatialNavigation.resume();
                return;
            }
        }

        if (e.keyCode === window.KeyEvent.DOM_VK_UP ||
            e.keyCode === window.KeyEvent.DOM_VK_LEFT) {
            scrollable.scrollUp();
        } else if (e.keyCode === window.KeyEvent.DOM_VK_DOWN ||
                   e.keyCode === window.KeyEvent.DOM_VK_RIGHT) {
            scrollable.scrollDown();
        }
    });

    z.page.on('keydown', '.privacy-content a', function(e) {
        if (e.keyCode !== window.KeyEvent.DOM_VK_RETURN) {
            return;
        }

        if (typeof MozActivity === 'function') {
            e.preventDefault();

            new MozActivity({
                name: 'view',
                data: {
                    type: 'url',
                    url: this.href
                }
            });
        }
    });

    return function(builder) {
        builder.start('privacy.html');

        builder.z('type', 'leaf');
        builder.z('title', gettext('Privacy Notice'));
    };
});
