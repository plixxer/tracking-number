const Number = require('./../models/number');

(function(){
	let NumberService = function(){};
	
	NumberService.prototype.getRecent = function(xDays, callbackSuccess, callbackError){
		Number.find({createdAt: {$gte: (new Date((new Date()).getTime() - (xDays * 24 * 60 * 60 * 1000)))}}, function(err, result){
			if(err){
				callbackError(err);
			}else{
				callbackSuccess(result);
			}
		}).sort({createdAt: 'desc'});
	}

	NumberService.prototype.insertUniqueTrackingNumbersRecords = function(records){
		let numberToInsert = records.map(function(elm){return elm.tracking_number;});
		Number.find(
			{ 
				"tracking_number": { $in: numberToInsert}
			}, 
			function(err, result){
				if(result){
					var db_numbers = result.map(function(elm){
						return elm.tracking_number;
					});
					var newNumbers = numberToInsert.filter(function(elem, index) {
						return db_numbers.indexOf(elem) == -1;
					});
					newNumbers = newNumbers.map(function(tracking_number){
						return records.filter(function(record){
							return record.tracking_number === tracking_number;
						}).map(function(record){//may iterate many times.
							return {
								ship_date: record.ship_date,
								tracking_number: record.tracking_number,
								shipping_carrier: record.shipping_carrier,
								shipping_method: record.shipping_method,
								tracking_url: record.tracking_url
							};
						})[0];
					});
					Number.insertMany(newNumbers, function(err, res){
						if(res){
							console.log("records added: ", res.length);
						}
					});
				}
	
			}
		);
	}

	module.exports = NumberService;
})();