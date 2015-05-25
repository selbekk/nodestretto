var fs = require('fs'),
    q = require('q');

var propertyStore = {},
    environment = process.env.NODE_ENV ? process.env.NODE_ENV.trim().toLowercase() : 'development';

function openPropertiesFile(filename) {

	if(!filename) {
		filename = 'environment.properties';
	}
	var deferred = q.defer();
	fs.readFile(filename, 'utf-8', function(err, file) {
		if(err) {
			console.error('Property file "' + filename + '" was not found. ');
			deferred.reject(new Error(err));
			return;
		}
		deferred.resolve(file);
	});
	return deferred.promise;
}

function parseProperties(rawData) {
    var lines = rawData.split('\n');
    lines.forEach(function(line, index) {
        line = line.trim();
        if(line.length === 0 || line.indexOf('#') > -1) {
            return; // Skip empty lines and comments
        }

        var isDefault = line.indexOf('@') !== 0;
        var nameIndex = line.indexOf('.');
        var valueIndex = line.indexOf('=');

        if(valueIndex === -1) {
            throw new Error('Error parsing line #' + index + '. Expected format is [@environment.]key=value');
        }

        var env = isDefault ? 'default' : line.slice(1, nameIndex);
        var name = line.slice(isDefault ? 0 : nameIndex + 1, valueIndex);
        var value = line.slice(valueIndex + 1);

        propertyStore[name] = propertyStore[name] || {};
        propertyStore[name][env] = value;
    });
}

module.exports = function(fileName) {
    openPropertiesFile(fileName)
        .then(parseProperties)
        .catch(console.error);

    return {
        get: function(key) {
            var property = propertyStore[key];
            if(!property) {
                throw new Error('Property "' + key + '" was not found.');
            }

            if(!property[environment]) {
                return property.default;
            }

            return property[environment];

        },
        getAsNumber: function(key) {
            return parseFloat(this.get(key));
        },
        getAsBoolean: function(key) {
            return this.get(key).toLowercase() === 'true';
        }
    };
};
