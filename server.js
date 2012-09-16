// https://npmjs.org/package/apn
// cp ../../../Scratch/aps_development.cer .
// openssl x509 -in aps_development.cer -inform DER -outform PEM -out aps_development.pem
// pkcs12 -in Certificates.p12 -out Certificates.pem -nodes


var util = require("util");
var express = require("express");
var personService = require("./personService.js");
var apn = require("apn");

var options = {
	// key: fs.readFileSync("../certs/code1up-key.pem"),
	// cert: fs.readFileSync("../certs/code1up-cert.pem")
};

var app = express();

app.use(express.bodyParser());
app.use(app.router);

var _errorCallback = function(err, notification) {
	console.log(util.inspect(err));
	console.log(util.inspect(notification));
};

var apnOptions = {
	cert: "./apn/aps_development.pem", // "apn-dev-cert.cer",
	key:  "./apn/Certificates.pem",
	ca: null,
	gateway: "gateway.sandbox.push.apple.com",
	port: 2195,
	enhanced: true,
	errorCallback: _errorCallback, // Callback when error occurs function(err, notification)
	cacheLength: 100
};

util.inspect(apnOptions);

var apnsConnection = new apn.Connection(apnOptions);
var myDevice = new apn.Device("b3d5af24a7fb1e81b90158913c29b69ee47c19fb479483a62fd9dae21486f015");
// var myDevice = new apn.Device("d6c0b7c0b9e81eef2b31940de9587a7e5f4c6ec3");

var note = new apn.Notification();

note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
note.badge = 3;
note.sound = "ping.aiff";
note.alert = "You have a new message.";
note.payload = {
	messageFrom: "Node.js"
};

note.device = myDevice;

app.get("/", function(req, res) {
	apnsConnection.sendNotification(note);
	console.log("Sent notification.");
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
