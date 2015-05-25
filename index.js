var fs = require('fs');

var propertyStore = {},
    environment = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase().trim() : 'development';

function load(filename) {
	var rawData = fs.readFileSync(filename, 'utf-8');
    parseProperties(rawData);
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

module.exports = function(filename) {
    load(filename);

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
