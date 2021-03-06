// external modules
var request = require('request');
var cheerio = require('cheerio');
var models = require('./models');
var AdExtraction = models.ad_extraction;

// personal modules
var urls = require('./ad_urls');

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

    var price = $('.productPriceBox').text().trim().replace("$","").replace(',','');
    if (price === "") {
      // if it is sold then the price box is hidden
      instance.price = 0;
    } else {
      instance.price = price;
    }

    instance.content = $('.productContentText').text().trim().replace(/[^a-zA-Z0-9 ]/g, "")
    instance.title = $('.productContentTitle').text().trim().replace(/[^a-zA-Z0-9 ]/g, "")
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

timedScraping();

