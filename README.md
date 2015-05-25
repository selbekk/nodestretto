# Nodestretto

Meet a properties module that cares about the environment.

Based loosely around the Java-library [Constretto](http://constretto.github.io), this module lets you 
differentiate your configuration for different environments. Do you have different databases in your 
staging and production environments, perhaps? Then this is for you.

Want to get started? 

	npm install nodestretto --save

## Usage

The library looks at the ``NODE_ENV`` environment variable in order to decide which property to return.

	var config = require('nodestretto')('./path/to/properties.file');

	var dbUrl = config.get('db.url');
	var dbTimeout = config.getAsNumber('db.port');
	var dbUseCache = config.getAsBoolean('db.useCache');

## Property files

	# This is how you would specify the db.url-property
	# with two overrides - test and production

	db.url=http://localhost:3306
	@test.db.url=http://test.example.com:3306
	@production.db.url=https://www.example.com:3306

## Open open source

If you want to help out, I'm not stingy about commit access. Send me a pull request if you want to help out, 
or just create an issue if it's not urgent.
