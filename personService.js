var request = require("request");
var util = require("util");

// TODO: var querystring = require("querystring");

var _baseUrl = "https://mongolab.com/api/1/databases/fakenames/collections/person?q=";
var _apiKey = "4e73cd495e4ce91f885b7ea3";

var _headers = {
	"content-type": 'text/json; charset="utf-8"'
};

exports.findPeopleNear = function(lat, lon, distance, callback) {
	var req = {
		geo: {
			$near: [
				lon,
				lat
			],
			$maxDistance: distance
		}
	};

	// TODO: use Node.js querystring module.
	var reqString = JSON.stringify(req);
	var encodedReqString = encodeURI(reqString);
	var queryString = encodedReqString + "&apiKey=" + _apiKey;

	var url = _baseUrl + queryString;

	console.log("-> " + url);

	var json = request.get({
		url: url,
		json: true
	}, function(error, res, people) {
		if (error) {
			callback(error, res);
		} else {
			callback(null, people);
		}	
	});
};
