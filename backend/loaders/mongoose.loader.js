var mongoose = require('mongoose');
var mongooseConfig = require('./../config/mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  console.log('Connected to MongoDB.');
});

mongoose.connect(mongooseConfig.url);