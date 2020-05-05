let request = require('request');

module.exports = (app) => {
	// home route - serves angular application
	app.get("/challenge", (req, res) => {
		res.sendFile("index.html", { root: __dirname + "/angular" });
	});
};