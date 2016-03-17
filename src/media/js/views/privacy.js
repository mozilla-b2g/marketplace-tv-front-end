define('views/privacy',
    ['core/l10n', 'core/z',
     'key_helper', 'smart_button', 'spatial_navigation', 'scrollable'],
    function(l10n, z,
             keyHelper, smartButton, SpatialNavigation, Scrollable) {
    var gettext = l10n.gettext;

    var $privacyButton;
    var $privacyContent;
    var $privacyContentLink;

    var hasFocused;
    var focusedIndex;

    var scrollable = new Scrollable();

    function focusPrivacyContentLink(index) {
        $privacyContentLink.eq(index).addClass('focused')
                                     .focus();

        focusedIndex = index;
    }

    function unfocusPrivacyContentLink(index) {
        if (typeof index === 'number') {
            $privacyContentLink.eq(index).removeClass('focused')
                                         .blur();
        } else {
            $privacyContentLink.removeClass('focused');
        }
    }

    z.page.on('loaded reloaded_chrome', function() {
        if (z.page.find('.privacy-container').length) {
            // Prevent the keyup event of enter key from previous page.
            hasFocused = false;

            // Reset the focus index.
            focusedIndex = 0;

            $privacyButton = z.page.find('.privacy-button');
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

    z.page.on('mouseover', '.privacy-button', function() {
        this.focus();
    });

    z.page.on('focus', '.privacy-button', function() {
        unfocusPrivacyContentLink();
    });

    z.page.on('transitionend', '.privacy-button', function() {
        if (!hasFocused && !this.classList.contains('pressed')) {
            hasFocused = true;
        }
    });

    z.page.on('keyup mouseup touchend', '.privacy-button', function(e) {
        if (e.type === 'keyup' && !keyHelper.isEnterKey(e.keyCode)) {
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
            setTimeout(function() {
                focusPrivacyContentLink(focusedIndex);
            });
        }

        SpatialNavigation.pause();
    });

    z.page.on('keydown', '.privacy-content', function(e) {
        if (!keyHelper.isUpKey(e.keyCode) &&
            !keyHelper.isLeftKey(e.keyCode) &&
            !keyHelper.isDownKey(e.keyCode) &&
            !keyHelper.isRightKey(e.keyCode)) {
            return;
        }

        var contentHeight = $privacyContent.height();
        var linkTop = $privacyContentLink.eq(focusedIndex).position().top;
        var linkFocused = $privacyContentLink.eq(focusedIndex)
                                             .hasClass('focused');

        if (keyHelper.isUpKey(e.keyCode) || keyHelper.isLeftKey(e.keyCode)) {
            if (linkFocused &&
                linkTop + scrollable.SCROLL_OFFSET > contentHeight) {
                // Unfocus when link is out of scrolling viewport.
                unfocusPrivacyContentLink(focusedIndex);
            }

            if (!linkFocused &&
                linkTop + scrollable.SCROLL_OFFSET >= 0 &&
                linkTop + scrollable.SCROLL_OFFSET < contentHeight) {
                focusPrivacyContentLink(focusedIndex);
            } else if (focusedIndex > 0) {
                // Focus previous link if it is inside scrolling viewport.
                var prevLinkTop = $privacyContentLink.eq(focusedIndex - 1)
                                                     .position().top;

                if (prevLinkTop + scrollable.SCROLL_OFFSET >= 0) {
                    unfocusPrivacyContentLink();
                    focusPrivacyContentLink(focusedIndex - 1);

                    if (prevLinkTop >= 0) {
                        return;
                    }
                }
            }

            if (scrollable.getScrollTop() === 0) {
                return;
            }
        }

        if (keyHelper.isDownKey(e.keyCode) || keyHelper.isRightKey(e.keyCode)) {
            if (linkFocused &&
                linkTop - scrollable.SCROLL_OFFSET < 0) {
                // Unfocus when link is out of scrolling viewport.
                unfocusPrivacyContentLink(focusedIndex);
            }

            if (!linkFocused &&
                linkTop - scrollable.SCROLL_OFFSET >= 0 &&
                linkTop - scrollable.SCROLL_OFFSET < contentHeight) {
                focusPrivacyContentLink(focusedIndex);
            } else if (focusedIndex < $privacyContentLink.length - 1) {
                // Focus next link if it is inside scrolling viewport.
                var nextLinkTop = $privacyContentLink.eq(focusedIndex + 1)
                                                     .position().top;

                if (nextLinkTop - scrollable.SCROLL_OFFSET < contentHeight) {
                    unfocusPrivacyContentLink();
                    focusPrivacyContentLink(focusedIndex + 1);

                    if (nextLinkTop < contentHeight) {
                        return;
                    }
                }
            }

            if (scrollable.getScrollTop() === scrollable.getScrollHeight()) {
                $privacyContent.focus();

                SpatialNavigation.resume();
                return;
            }
        }

        if (keyHelper.isUpKey(e.keyCode) || keyHelper.isLeftKey(e.keyCode)) {
            scrollable.scrollUp();
        } else if (keyHelper.isDownKey(e.keyCode) ||
                   keyHelper.isRightKey(e.keyCode)) {
            scrollable.scrollDown();
        }
    });

    z.page.on('mouseover', '.privacy-content a', function() {
        var currentLink = this;

        $privacyButton.blur();

        $privacyContentLink.each(function(index) {
            if (this === currentLink) {
                focusPrivacyContentLink(index);
            } else if (this.classList.contains('focused')) {
                unfocusPrivacyContentLink(index);
            }
        });
    });

    z.page.on('keydown mousedown touchstart',
              '.privacy-content a', function(e) {
        if (e.type === 'keydown' && !keyHelper.isEnterKey(e.keyCode)) {
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
