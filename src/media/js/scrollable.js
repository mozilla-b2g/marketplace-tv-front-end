define('scrollable', function() {
    var Scrollable = function Scrollable() {
        this.SCROLL_OFFSET = 100;
    };

    Scrollable.prototype.init = function s_init($element) {
        this.$element = $element;

        this.$scrollable = $element.find('.scrollable');
        this.$scrollbar = $element.find('.scrollbar');

        if (this.getScrollHeight() > 0) {
            this.$scrollbarHolder = this.$scrollbar.find('.holder');

            this.$scrollbar.removeClass('hidden');
        }
    };

    Scrollable.prototype.getScrollTop = function s_getScrollTop() {
        return Math.abs(parseInt(this.$scrollable.css('margin-top'), 10));
    };

    Scrollable.prototype.getScrollHeight = function s_getScrollHeight() {
        var scrollHeight = this.$scrollable.height() - this.$element.height();

        return scrollHeight > 0 ? scrollHeight : 0;
    };

    Scrollable.prototype.scrollUp = function s_scrollUp() {
        var scrollTop = this.getScrollTop();

        scrollTop = scrollTop - this.SCROLL_OFFSET > 0 ?
                    scrollTop - this.SCROLL_OFFSET : 0;

        this.setScrollTop(scrollTop);
    };

    Scrollable.prototype.scrollDown = function s_scrollDown() {
        var scrollTop = this.getScrollTop();
        var scrollHeight = this.getScrollHeight();

        scrollTop = scrollTop + this.SCROLL_OFFSET < scrollHeight ?
                    scrollTop + this.SCROLL_OFFSET : scrollHeight;

        this.setScrollTop(scrollTop);
    };

    Scrollable.prototype.setScrollTop = function s_setScrollTop(scrollTop) {
        var scrollPercent = scrollTop / this.getScrollHeight();
        var scrollbarHeight = this.$scrollbar.height() -
                              this.$scrollbarHolder.height() - 65;

        this.$scrollable.css('margin-top', -scrollTop);
        this.$scrollbarHolder.css('top', scrollPercent * scrollbarHeight + 3);
    };

    return Scrollable;
});
