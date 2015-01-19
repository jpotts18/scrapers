// external modules
var request = require('request');
var cheerio = require('cheerio');
var Sequelize = require('sequelize');

// personal modules
var urls = require('./all_urls');

var sequelize = new Sequelize('', '', '', {
  	dialect: 'sqlite',
  	storage: 'db.sqlite',
    logging: null
  });

// Stars + forks + last_update
// last_update creation_date = Old library with recent changes 
// 
// Issues compared to issue closed
// size

// Model definition

var Library = sequelize.define('library', {
  name: Sequelize.STRING,
  tag: Sequelize.STRING,
  license: Sequelize.STRING,
  repoLink: Sequelize.STRING,
  githubUser: Sequelize.STRING,
  githubRepo: Sequelize.STRING,
});

// var WAIT = 15 * 60 * 1000; // 15 minutes
// var WAIT = 1 * 60 * 1000; // 1 minute
var WAIT = 2 * 1000; // 3 seconds
var DOMAIN = 'https://android-arsenal.com';
var GITHUB_REGEX = /^.*github\.com\/(.*?)\/(.*?)$/;
var url = DOMAIN + '/details/1/815';

var parseItem = function($){
  var instance = {};
  var data = {};

  // Dom parsing
  console.log('Parsing    ---');
  $('dl.dl-horizontal dt').each(function(){
    data[$(this).text().toLowerCase()] = $(this).next().text();
  });

  instance.name = $('h1 a').text();
  instance.tag = data.tag;
  instance.repoLink = data.link;
  instance.license = data.license;

  // Regex 
  var match = GITHUB_REGEX.exec(data.link);
  if (match != null) {
    instance.githubUser = match[1];
    instance.githubRepo = match[2];
  }

  Library
    .create(instance)
    .then(function(lib){
      console.log('Saving     <-- ' + lib.values.id + ' ' + lib.values.name + ' ' + lib.values.repoLink);
    }).catch(function(err){
      console.log(err);
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

