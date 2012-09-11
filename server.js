var express = require("express");
var personService = require("./personService.js");

var options = {
	// key: fs.readFileSync("../certs/code1up-key.pem"),
	// cert: fs.readFileSync("../certs/code1up-cert.pem")
};

var app = express();

app.use(express.bodyParser());
app.use(app.router);

app.get("/", function(req, res) {
	res.send("This is a Node.js application.");
});

app.get("/api/1/people/near/:lat/:lon/:proximity", function(req, res, next) {
	var lat = req.params.lat;
	var lon = req.params.lon;
	var proximity = req.params.proximity;

	console.log(lat);
	console.log(lon);
	console.log(proximity);

	res.contentType("text/json");

	/*
	res.send({
		lat: lat,
		lon: lon,
		proximity: proximity
	});
	*/
	
	personService.findPeopleNear(lat, lon, proximity, function(error, data) {
		if (error) {
			res.send(error);
		} else {
			res.send(data);
		}
	});
});

app.listen(3000);

console.log("\n<<< started");
