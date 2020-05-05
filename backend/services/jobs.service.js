(function(){
	let JobsService = function(){
		this.TIME = {'SECOND': 1000, 'MINUTE': 1000 * 60, 'HOUR': 1000 * 60 * 60, 'DAY': 1000 * 60 * 60 * 24};
	};
	
	JobsService.Jobs = [];
	JobsService.prototype.add = function(callback, time, initialRun){
		if(initialRun)
			callback();
		JobsService.Jobs.push(setInterval(callback, time)); // 1 hour
	}

	JobsService.prototype.stopJobs = function(){
		clearInterval(JobsService.Jobs[0]);
	}

	module.exports = JobsService;
})();