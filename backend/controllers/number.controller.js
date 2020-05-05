let NumberService = require('./../services/number.service');

let numberService = new NumberService();

module.exports = function(app) {
	app.get('/api/recent/:xDays', function(req, res){
		numberService.getRecent(req.params.xDays, function(number){
			res.json(number);
		},
		function(err){
			res.statusCpde = 400;
			res.Send(err);
		});
	});
};