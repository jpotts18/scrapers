// external modules
var request = require('request');
var cheerio = require('cheerio');
var Sequelize = require('sequelize');

// personal modules
var urls = require('./ad_urls');

var sequelize = new Sequelize('ksl', 'root', 'root', {
  	dialect: 'mysql',
    logging: false
  });

// Model definition

var AdExtraction = sequelize.define('ad_extraction', {
  title: Sequelize.STRING,
  adNumber: Sequelize.INTEGER,
  postDate: Sequelize.STRING,
  daysOnline: Sequelize.STRING,
  listingType: Sequelize.STRING,
  pageViews: Sequelize.INTEGER,
  sellersAccount: Sequelize.STRING,
  price: Sequelize.INTEGER,
  pictureCount: Sequelize.INTEGER,
  content: Sequelize.TEXT,
  contact: Sequelize.STRING,
  phoneLabel: Sequelize.STRING,
  phone: Sequelize.STRING
})

var WAIT = 2 * 1000; // 1 seconds
var DOMAIN = 'http://www.ksl.com/?nid=218&ad=';

var parseItem = function($){
    var instance = {};

    console.log('Parsing    ---');
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
        instance.pageViews = parseInt($(this).next().text());
      } else if (key === 'Sellers Account') {
        instance.sellersAccount = $(this).next().text();
      }
    });

    $('span.productPriceCents').remove(); // who cares about cents?
    $('span.productPriceSub').remove(); // OBO's will mess this up

    instance.price = $('.productPriceBox').text().trim().replace("$","");
    instance.content = $('.productContentText').text().trim();
    instance.title = $('.productContentTitle').text().trim();
    instance.pictureCount = $('.productImageEnlarge').length + $('.productImageSmall').length;
    instance.contact = $('.productContactName').text().trim();
    
    instance.phoneLabel = $('span.productContactPhoneLabel').text().trim();
    $('span.productContactPhoneLabel').remove();
    instance.phone = $('.productContactPhone').text().trim();

    AdExtraction.create(instance).then(function(ad){
      console.log('Saving     <-- ' + ad.values.price + ' ' + ad.values.title);
    }).catch(function(err){
      if (err) throw err;
    });
};

var scrapeAndLoad = function(url, parseItem){
  console.log('Scraping   --> ' + url);
  request(url, function(err, response, body){
    if (err) throw err;
    parseItem(cheerio.load(body));
  });
};

var timedScraping = function(){
  var i = 0;
  var interval = setInterval(function(){
    
    var url = DOMAIN + urls[i];
    scrapeAndLoad(url, parseItem);
    i++;

    if (i == urls.length) {
      clearInterval(interval);
      console.log('*** Finished ***');
    }
  }, WAIT);
};

sequelize.sync().then(function(){
  timedScraping();
});

