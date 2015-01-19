# Android Arsenal Reproducable Steps

## Questions

1. What are the most popular Android repositories per category. *Descriptive*
1. What features are the most indicative of repository quality. *Predictive*  
1. How are these libraries changing overtime. *Trend over time* 

## Extraction

1. Data will first be extracted from a catalog of android libraries using a google chrome extension called [Scraper](https://chrome.google.com/webstore/detail/scraper/mbigbapnjcgaffohmbkdlecaccepngjd). In this case I have used [Android Arsenal](https://android-arsenal.com/free) as my reference. This catalog has details for 1170 repositories.

1. After scraping the details for the 1170 libraries I noticed that 970 (82.9%) repositories were hosted on Github. Since a large majority of these libraries were hosted on Github I decided to use [Octokit](http://octokit.github.io/octokit.rb/) to extract repo specific data.
