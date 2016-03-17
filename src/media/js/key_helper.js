define('key_helper', function() {
    var keyEvent = window.KeyEvent || {
        DOM_VK_BACK_SPACE: 8,
        DOM_VK_RETURN: 13,
        DOM_VK_LEFT: 37,
        DOM_VK_UP: 38,
        DOM_VK_RIGHT: 39,
        DOM_VK_DOWN: 40
    };

    function isBackKey(keyCode) {
        return keyCode === keyEvent.DOM_VK_BACK_SPACE;
    }

    function isEnterKey(keyCode) {
        return keyCode === keyEvent.DOM_VK_RETURN;
    }

    function isLeftKey(keyCode) {
        return keyCode === keyEvent.DOM_VK_LEFT;
    }

    function isUpKey(keyCode) {
        return keyCode === keyEvent.DOM_VK_UP;
    }

    function isRightKey(keyCode) {
        return keyCode === keyEvent.DOM_VK_RIGHT;
    }

    function isDownKey(keyCode) {
        return keyCode === keyEvent.DOM_VK_DOWN;
    }

    return {
        isBackKey: isBackKey,
        isEnterKey: isEnterKey,
        isLeftKey: isLeftKey,
        isUpKey: isUpKey,
        isRightKey: isRightKey,
        isDownKey: isDownKey
    };
});
