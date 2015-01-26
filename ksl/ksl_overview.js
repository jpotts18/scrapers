// external modules
var request = require('request');
var cheerio = require('cheerio');
var Sequelize = require('sequelize');

var DOMAIN = 'http://www.ksl.com';
var URL = DOMAIN + '/?nid=47';
var LINK_REGEX = /^\?nid=(.*?)&cat=(.*?)&category=(.*?)$/;
var LOAD_SUB_CATEGORY = false;

var sequelize = new Sequelize('ksl', 'root', 'root', {
  	dialect: 'mysql',
    logging: null
  });

// Model definition

var SubCategory = sequelize.define('sub_category', {
  categoryId : Sequelize.INTEGER,
  subCatId : Sequelize.INTEGER, 
  link : Sequelize.STRING,
  name : Sequelize.STRING
})

var Extraction = sequelize.define('extraction', {
  categoryId : Sequelize.INTEGER,
  subCatId : Sequelize.INTEGER,
  count: Sequelize.INTEGER
});

var parseItem = function($) {
  var data = {};

  $('.categorySubsItem').each(function(category){

    data.link = $(this).find('a').attr('href');
    data.name = $(this).find('.categorySubsItemTitle').text();
    data.count = $(this).find('.categorySubsItemCount').text().split(',').join('');
    var match = LINK_REGEX.exec(data.link);

    if (match !== null) {
      data.subCatId = match[2];
      data.categoryId = match[3];

      if (LOAD_SUB_CATEGORY) {
        saveSubCategory(data);
      } else {
        saveExtraction(data);  
      }
    } 
  });
};

var saveExtraction = function(data){
  Extraction
    .create(data)
    .then(function(ex){
      console.log(ex.values);
    });
}

var saveSubCategory = function(data){
  SubCategory
    .create(data)
    .then(function(sub){
      console.log(sub.name);
    });
}

var scrapeAndLoad = function(url, parseItem){
  console.log('Scraping   --> ' + url);
  request(url, function(err, response, body){
    if (err) throw err;
    parseItem(cheerio.load(body));
  });
};

sequelize.sync().then(function(){
  scrapeAndLoad(URL, parseItem);
});

