define('spatial_navigation', ['lib/spatial_navigation'],
    function(SpatialNavigation) {

    // Initialize spatial navigation.
    SpatialNavigation.init();

    // Define the navigable elements.
    SpatialNavigation.add({
        selector: '.focusable',
        enterTo: 'last-focused'
    });

    SpatialNavigation.startFocus = function(element) {
        // Add 'tabindex="-1"' to "currently-existing" navigable elements.
        SpatialNavigation.makeFocusable();

        // Focus the first navigable element.
        SpatialNavigation.focus(element);
    };

    return SpatialNavigation;
});
