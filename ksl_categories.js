var request = require('request')
  , cheerio = require('cheerio')
  , async = require('async')
  , moment = require('moment')
  , format = require('util').format
  , _ = require('lodash')
  , fs = require('fs');

var CATEGORY_ROOT = 'http://www.ksl.com/?nid=231&cat=';

var MAX_WAIT = 60000;
var MIN_WAIT = 5000;

var DATA_FOLDER = __dirname +'/raw';
var OVERVIEW_FOLDER =  DATA_FOLDER + '/overview';
var CATEGORY_FOLDER = DATA_FOLDER + '/category';
var AD_FOLDER = DATA_FOLDER + '/ad';

var LINK_REGEX = /^\?nid=(.*?)&cat=(.*?)&category=(.*?)$/;
var AD_REGEX = /^\?nid=218&ad=(.*?)&.*$/;

var startingUrl = 'http://www.ksl.com/?nid=47';
var categoryUrl = 'http://www.ksl.com/?nid=231&cat=7&category=1';
var adUrl = 'http://www.ksl.com/?nid=218&ad=33094709&cat=212&lpid=&search=&ad_cid=4';

var requestOptions = {
  url: '',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
  }
};

var saveFile = function(body, dest) {
  fs.writeFile(dest, body, function(error) {
      if (error) throw error;
      console.log('Saved File: ' + dest);
    });
}

var reqOpts = function(url){
  return {
    url: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    }
  };
}

var saveAndLoad = function(err, response, body) {
  saveFile(body, OVERVIEW_FOLDER + '/' + moment().format() + '.html');
  var $ = cheerio.load(body);
}

var kslOverview = function() {

  request(reqOpts(startingUrl), function(err, response, body) {
    if (err) throw err;

    saveFile(body, OVERVIEW_FOLDER + '/' + moment().format() + '.html');
    var $ = cheerio.load(body);

    console.log('name,count,link,catId,categoryId')

    $('.categorySubsItem').each(function(category){

      var name = $(this).find('.categorySubsItemTitle').text();
      var count = $(this).find('.categorySubsItemCount').text();
      var link = $(this).find('a').attr('href');
      var match = LINK_REGEX.exec(link);
      if (match !== null) {
        var catId = match[2];
        var categoryId = match[3];
        
        _.delay(kslCategory, _.random(MIN_WAIT, MAX_WAIT), catId);

        console.log(name + ',' + count + ',' + link + ',' + catId + ',' + categoryId);
      } else {
        console.log(name + ',' + count + ',' + link);  
      }
      
    })
  });
};


var kslCategory = function(catId) {

  request(CATEGORY_ROOT + catId, function(err, response, body) {
    if (err) throw err;
    var links = [];
    saveFile(body, CATEGORY_FOLDER + '/' + catId + '--' + moment().format('YYYY-MM-DD')  + '.html');
    var $ = cheerio.load(body);

    // $('#facets_state .facetItem').each(function(){
    //   var item = $(this).find('span.facetItemItem').text();
    //   var count = $(this).find('span.facetItemCount').text();
    //   console.log(item + ' => ' + count);
    // });

    // $('#facets_posttime .facetItem').each(function(){
    //   var item = $(this).find('span.facetItemItem').text();
    //   var count = $(this).find('span.facetItemCount').text();
    //   console.log(item + ' => ' + count);
    // });

    // $('#facets_sellertype .facetItem').each(function(){
    //   var item = $(this).find('span.facetItemItem').text();
    //   var count = $(this).find('span.facetItemCount').text();
    //   console.log(item + ' => ' + count);
    // });

    $('.adBox').each(function(){
      var adLink = $(this).find('a.listlink').attr('href');
      var match = AD_REGEX.exec(adLink);
      if (match !== null) {
        var adId = match[1];
        console.log('http://ksl.com/' + adLink);
      }
    });

  });

};

var kslAdvertisment = function(){
  request(adUrl, function(err, response, body){
    if (err) throw err;

    var $ = cheerio.load(body);

    var adExtraction = {};

    $('.productMoreInfoLabel').each(function(){
      var key = $(this).text().split(':').join('');
      if (key === 'Ad Number'){
        adExtraction.adNumber = parseInt($(this).next().text());
      } else if (key === 'Post Date') {
        adExtraction.postDate = $(this).next().text();
      } else if (key === 'Days Online') {
        adExtraction.daysOnline = $(this).next().text();
      } else if (key === 'Listing Type') {
        adExtraction.listingType = $(this).next().text();
      } else if (key === 'Page Views') {
        adExtraction.pageViews = parseInt($(this).next().text());
      } else if (key === 'Sellers Account') {
        adExtraction.sellersAccount = $(this).next().text();
      }
    });

    $('span.productPriceCents').remove(); // who cares about cents?

    adExtraction.price = $('.productPriceBox').text().trim();
    adExtraction.content = $('.productContentText').text().trim();
    adExtraction.contact = $('.productContactName').text().trim();
    
    adExtraction.phoneLabel = $('span.productContactPhoneLabel').text().trim();
    $('span.productContactPhoneLabel').remove();
    adExtraction.phone = $('.productContactPhone').text().trim();

    

  })
};


// kslOverview();
// kslCategory();
// kslCategoryCrawler();
kslAdvertisment();
