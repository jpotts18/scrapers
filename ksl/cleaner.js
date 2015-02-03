var _ = require('lodash');
var models = require('./models');
var AdExtraction = models.ad_extraction; // goes by database table name

// AdExtraction.find().then(function(ext){
// 	cleanData(ext, ext.title);
// 	cleanData(ext, ext.content);
// })

var ads = [
	"13in MacBook 2.0GHz 160GB hard drive",
	"Updated 1TB hard drive; 2.4GHz Intel Core 2 Duo; Please go to: http://support.apple.com/kb/SP16 for a list of all the specs. I have upgraded to Yosemite and it runs great. The screen is a nice size and it's in good shape. Perfect for internet browsing, photo editing, document editing, etc. The DVD/CD drive is good to have as well. 475.00 OBO. Texting is best.",
	"I have a 13 inch MacBook Pro 2011 in amazing condition. Everything works and functions amazing. It's been kept on a desk for most of it's life. Amazing laptop, it runs great. Comes with the original charger. Asking 575. If you're interested or have any questions please shoot me a text at 801-845-4970 thanks and have a great day :)",
	"Here are the specs: Processor: 2.4 GHz Intel Core i5 Memory: 4GB 1333 MHz DDR3 Graphics: Intel HD Graphics 3000 384 MB 500 GB",
	"Selling a 13\" macbook air still in box and shrinkwrap. Never been opened, never been registered. Received as a Christmas gift, but have no use for it. Same item as seen here: http://store.apple.com/us/buy-mac/macbook-air?product=MD760LL/B&step=config# Can meet anywhere in the greater salt lake city area. $900 obo. No trade, cash only.",
 	"2011 - 27\" iMac 2.7 i5 Quad Core GHz (With Turbo Boost to 3.4) 8 GB Ram 1TB Hybrid Hard Drive (Special Upgrade) Brand New LCD (Replaced by Apple)",
 	"Apple Macbook Air 11, i7 2gz, 8gb - 512gb SSD $1300 Negotiable, Practically new in box with all accessories, and case, includes Applecare.",
 	"I have a 2008 Mac Pro 2 x 3 GHz Quad-Core 8 core machine this thing is a monster it is still as fast as some of the newest computers today. There is absolutely nothing wrong with it I just upgraded so that is why I'm selling it. It has OSX Lion installed and is ready to go. Here are the specs SPECS: 2008 Processor - 2 x 3 GHz Quad-Core (8 core) Memory - 8 GB 667 MHz DDR2 Hard drive - 1 TB "
];

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

console.log(cleanData({}, ads[0]));