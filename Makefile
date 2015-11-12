# make install - getting an error? Run `npm install` first.
#                The directive comes from mozilla/marketplace-gulp.
install:
	@echo "ERROR: Please run `npm install` before running `make install`".

-include node_modules/marketplace-gulp/Makefile

TEST_URL?='http://localhost:8674'
