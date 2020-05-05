let mongoose = require('mongoose'), Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

const numberSchema = new Schema({
	foundOn: { type: Date },
	number: {type: String}
});

module.exports = mongoose.model('number', numberSchema);