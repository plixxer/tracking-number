// require dependencies
let express = require('express');
let bodyParser = require('body-parser');
let logger = require('morgan');
var http = require('http');
let Routes = require('./routes.js');

// define port (feel free to change this) and express app
let app = express();

app.set('port', process.env.PORT || 3000);
// mount middleware
app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('angular'));


//Database Setup
require('./backend/loaders/mongoose.loader');

//Controllers Setup
require('./backend/loaders/controllers.loader')(app, "controllers/");



// app routes
Routes(app);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Application running on port ' + app.get('port'));
});

let Scraper = new (require('./backend/services/scraper.service'))();
let Jobs = new (require('./backend/services/jobs.service'))();
let NumberService = new (require('./backend/services/number.service'))();
Jobs.add(function(){
	Scraper.get(function(response){
		let uniqueRecords = Scraper.uniqueRecords(response);
		console.log("inserting unique tracking numbers: [" + uniqueRecords.map(function(elm){return elm.tracking_number;}).join(', ') + ']');
		NumberService.insertUniqueTrackingNumbersRecords(uniqueRecords);
	});
}, Jobs.TIME.HOUR, true);
