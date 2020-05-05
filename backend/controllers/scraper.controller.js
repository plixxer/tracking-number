let ScraperService = require('../services/scraper.service');

let scraperService = new ScraperService();

module.exports = function(app) {
	app.get('/api/tracking/:mode/:trackingNumber', function(req, res){
		scraperService.tracking(req.params.trackingNumber, req.params.mode, function(day, date){
			res.json([day, date]);
		},
		function(err){
			res.statusCpde = 400;
			res.Send(err);
		});
	});
};