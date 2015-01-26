// external modules
var request = require('request');
var cheerio = require('cheerio');
var Sequelize = require('sequelize');

// Constructor
function Scraper(options){
	this.opts = options;	
	this.dbConnection = opts.dbConnection;
	this.dbOptions = opts.dbOptions;
	this.sequelize = Sequelize(
		this.dbConnection.name, 
		this.dbConnection.user, 
		this.dbConnection.password, 
		this.dbOptions
	);

};

// Methods
Scraper.prototype.schemaDefinition = function() {
	
}

Scraper.prototype.intializeDatabase = function() {
		
}

Scraper.prototype.parseItem = function($) {

}

Scraper.prototype.start = function(){

}

Scraper.prototype.parseDom = function() {

};

var options = {
	wait: 2 * 1000,
	domain: 'https://android-arsenal.com',
	logging: true,
	dbConnection: { name: 'android_arsenal', user: 'root', password: 'root', dialect: 'mysql'},
	dbOptions: { dialect: 'mysql'}

}

var kslCategory = Scraper();

kslCategory.schemaDefinition

