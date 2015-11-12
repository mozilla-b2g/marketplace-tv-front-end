casper.test.begin('Test hompage loads', {
    test: function(test) {
        helpers.startCasper();

        casper.waitForSelector('#page h1', function() {
            test.assertTextExists('Hello World!');
        });

        helpers.done(test);
    }
});
