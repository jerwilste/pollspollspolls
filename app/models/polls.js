'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
	id: String,
	number: Number,
	owner: String,
	question: String,
    answers: Array
	
});

module.exports = mongoose.model('Poll', Poll);

/*
var test = new Poll({
	id: 1,
	owner: "jerwilste",
	question: "am I dumb?",
    answers: ["yes","no"]
});

test.save(function(err) {
  if (err) throw err;

  console.log('Poll created!');
});

Poll.find({}, function(err, polls) {
  if (err) throw err;

  // object of all the users
  console.log(polls);
});
*/
