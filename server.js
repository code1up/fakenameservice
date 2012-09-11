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

app.get("/api/1/people/near/:lat/:lon/:distance", function(req, res, next) {
	var lat = parseFloat(req.params.lat);
	var lon = parseFloat(req.params.lon);
	var distance = parseFloat(req.params.distance);

	console.log(lat);
	console.log(lon);
	console.log(distance);

	res.contentType("text/json");

	/*
	res.send({
		lat: lat,
		lon: lon,
		distance: distance
	});
	*/
	
	personService.findPeopleNear(lat, lon, distance, function(error, data) {
		if (error) {
			res.send(error);
		} else {
			res.send(data);
		}
	});
});

app.listen(process.env.port || 3000);

console.log("\n<<< started");
