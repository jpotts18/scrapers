var request = require('request');
var cheerio = require('cheerio');
var Sequelize = require('sequelize');


var sequelize = new Sequelize('ksl_data', 'root', '', {
  	dialect: 'sqlite',
  	storage: 'db.sqlite'
  });
 
var Subcategory = sequelize.define('sub_category', {
  name: Sequelize.STRING,
  count: Sequelize.INTEGER
});

var AdExtraction = sequelize.define('ad_extraction', {
	adNumber: Sequelize.INTEGER,
	postDate: Sequelize.STRING,
	daysOnline: Sequelize.STRING,
	listingType: Sequelize.STRING,
	pageViews: Sequelize.INTEGER,
	sellersAccount: Sequelize.STRING,
	price: Sequelize.INTEGER,
	content: Sequelize.TEXT,
	contact: Sequelize.STRING,
	phoneLabel: Sequelize.STRING,
	phone: Sequelize.STRING
})

var Advertisment = sequelize.define('advertisment', {
	price: Sequelize.INTEGER,
	content: Sequelize.TEXT,
	contact: Sequelize.STRING,
	phoneLabel: Sequelize.STRING,
	phone: Sequelize.STRING
});

// var WAIT = 15 * 60 * 1000; // 15 minutes
// var WAIT = 1 * 60 * 1000; // 1 minute
var WAIT = 5 * 1000; // 15 seconds

var adUrl = 'http://www.ksl.com/?nid=218&ad=33094709&cat=212&lpid=&search=&ad_cid=4';

var kslAdvertisment = function(){
  request(adUrl, function(err, response, body){
    if (err) throw err;

    var $ = cheerio.load(body);

    var instance = {};

    $('.productMoreInfoLabel').each(function(){
      var key = $(this).text().split(':').join('');
      if (key === 'Ad Number'){
        instance.adNumber = parseInt($(this).next().text());
      } else if (key === 'Post Date') {
        instance.postDate = $(this).next().text();
      } else if (key === 'Days Online') {
        instance.daysOnline = $(this).next().text();
      } else if (key === 'Listing Type') {
        instance.listingType = $(this).next().text();
      } else if (key === 'Page Views') {
      	// -1 is to not count the scrape in the stats
        instance.pageViews = parseInt($(this).next().text() - 1);
      } else if (key === 'Sellers Account') {
        instance.sellersAccount = $(this).next().text();
      }
    });

    $('span.productPriceCents').remove(); // who cares about cents?

    instance.price = $('.productPriceBox').text().trim();
    instance.content = $('.productContentText').text().trim();
    instance.contact = $('.productContactName').text().trim();
    
    instance.phoneLabel = $('span.productContactPhoneLabel').text().trim();
    $('span.productContactPhoneLabel').remove();
    instance.phone = $('.productContactPhone').text().trim();

    AdExtraction.create(instance).then(function(ad){
    	console.log('Ad => ' + ad.values.adNumber);
    }).catch(function(err){
    	if (err) throw err;
    });

  })
};

sequelize.sync().success(function(){

console.log('Initializing...');

setInterval(kslAdvertisment, WAIT);

});


