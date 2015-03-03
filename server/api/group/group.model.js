(function() {
	'use strict';

	var mongoose 	= require('mongoose'),
	    Schema 		= mongoose.Schema,
	    ObjectId	= Schema.Types.ObjectId;

	var trackSchema = new Schema({
		track_id			: {
			type: String,
			required: '{PATH} is required!',
		},
		name					: {
			type: String,
			required: '{PATH} is required!',
		},
		submitted_by	: {
			type: ObjectId,
			ref: 'User',
			required: '{PATH} is required!'
		},
		upvotes				: [{ type: ObjectId, ref: 'User' }],
		downvotes			: [{ type: ObjectId, ref: 'User' }],
		created_at 		: { type: Date, default: Date.now },
		last_update 	: { type: Date, default: Date.now }
	});

	var groupSchema = new Schema({
		name 					: { 
			type: String,
			required: '{PATH} is required!',
			unique: true
		},
		owner					: {
			type: ObjectId,
			ref: 'User',
			required: '{PATH} is required!'
		},
		tracks				: [trackSchema],
		contributors	: [{ type: ObjectId, ref: 'User' }],
		followers			: [{ type: ObjectId, ref: 'User' }],
		public				: { type: Boolean, default: 'True' },
		created_at 		: { type: Date, default: Date.now },
		last_update 	: { type: Date, default: Date.now }
	});

	module.exports = mongoose.model('Group', groupSchema);

})()