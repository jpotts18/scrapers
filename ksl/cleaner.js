var _ = require('lodash');
var models = require('./models');
var AdExtraction = models.ad_extraction; // goes by database table name

AdExtraction.findAll().then(function(ext){
	cleanData(ext, ext.title);
	cleanData(ext, ext.content);
	ext.save().then(function(){ console.log('Updated : ' + ext.id ); });
});

var YEAR_REGEX = /20\d{2}/
var MEMORY_REGEX = /([1-9][0-9]?)\s*gb/
var SCREEN_SIZE_REGEX = /(^|\s)(11|13|15|17|21|27)(\.\d)?\s*"?-?(inches|inch|in.|in)?\s/
var MODEL_REGEX = /macbook air|macbook pro|macbook|imac|mac pro/
var ZIP_REGEX = /\d{5}/
var RETINA_REGEX = /retina|retna|retnia/
var OBO_REGEX = /obo|obo./
var PROCESSOR_SPEED_REGEX = /\d(\.\d)?\s*ghz/
var HD_REGEX = /(\d{3})\s*gb|(\d{1})\s*tb/
var CASH_REGEX = /cash/

// to lowercase

var search = function(str, regex, def){
	var match = regex.exec(str)
	if (match !== null) {
		return match[0].trim();
	}
	return def;
}

var cleanData = function(obj, str){
	var str = str.toLowerCase();

	obj.processor = search(str, PROCESSOR_SPEED_REGEX, "");
	obj.year = search(str, YEAR_REGEX, "");
	obj.zipCode = search(str, ZIP_REGEX, "");
	obj.model = search(str, MODEL_REGEX, "");
	obj.screenSize = search(str, SCREEN_SIZE_REGEX, "");
	obj.memory = search(str, MEMORY_REGEX, "");
	obj.hardDrive = search(str, HD_REGEX, "");

	return obj;
};