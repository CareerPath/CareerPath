var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
mongoose.connect('mongodb://careerpath:careerpath@ds047591.mongolab.com:47591/career_path')
var Profile = mongoose.model('LinkedinProfile', new Schema({
	id : {
		type: String,
		unique: true
	},
	name: String,
	first_name: String,
	last_name: String,
	title: String,
	location: String,
	country: String,
	industry: String,
	summary: String,
	picture: String,
	linkedin_url: String,
	education: String,
	groups: [{
		name:String,
		link: String
	}],
	websites: [String],
	languages: [String],
	skills: String,
	past_companies: [{
		title: String,
		company: String
	}],
	current_companies: [{
		title: String,
		company: String
	}]
}));
module.exports = Profile;