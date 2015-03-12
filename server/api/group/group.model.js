(function() {
	'use strict';

	var mongoose 	= require('mongoose'),
	    Schema 		= mongoose.Schema,
	    User		= require('../user/user.model'),
	    ObjectId	= Schema.Types.ObjectId;

	var trackSchema = new Schema({
		track_id			: {
			type: Number,
			required: '{PATH} is required!'
		},
		track_url			: {
			type: String,
			required: '{PATH} is required!',
		},
		title				: {
			type: String,
			required: '{PATH} is required!',
		},
		artist				: {
			type: String,
			required: '{PATH} is required!',
		},
		submitted_by	: {
			type: ObjectId,
			ref: 'User',
			required: '{PATH} is required!'
		},
		submitted_by_name	: {
			type: String,
			required: '{PATH} is required!'
		},
		image_url: String,
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
			"user_id": { type: ObjectId, ref: 'User' },
			"user_name": String
		},
		tracks				: [trackSchema],
		contributors	: [{
			"user_id": { type: ObjectId, ref: 'User' },
			"user_name": String
		}],
		followers			: [{
			"user_id": { type: ObjectId, ref: 'User' },
			"user_name": String
		}],
		public				: { type: Boolean, default: 'True' },
		created_at 		: { type: Date, default: Date.now },
		last_update 	: { type: Date, default: Date.now }
	});

	module.exports = mongoose.model('Group', groupSchema);

})()