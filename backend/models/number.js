var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NumberSchema = new Schema({
	ship_date: {type: Date},
	tracking_number: {type: String, unique: true},
	shipping_method: {type: String},
	tracking_url: {type: String},
	shipping_carrier: {type: String}
}, 
	{timestamps: true}
);

module.exports = mongoose.model('Number', NumberSchema);