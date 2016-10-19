//TODO - add html sanitation to the addPoll and add voteOption feature

'use strict'

var Polls = require('../models/polls.js');

function PollHandler(){
    
    this.addPoll = function(req, res, callback){
        //console.log('in here');
        console.log(req.body.question + ' ' + req.body.answers);
        if (req.body.question !== undefined && req.body.question !== "" && req.body.answers !== undefined && req.body.answers !== ""){
            
            Polls.find({}, function(err, polls) {
                if (err) throw err;
                console.log('polls length is: '+polls.length);
                var num = polls.length;
                var a = req.body.answers.replace(/\r/g,"").split('\n');
                a = a.map(function(val){
                    let t = {
                        answer: val,
                        voteNum: 0
                    };
                    return t;
                });
                
                var test = new Polls({
                    number: num,
        	        owner: req.user.github.username,
        	        question: req.body.question,
                    answers: a
                });
    
                test.save(function(err) {
                    if (err) throw err;
                
                    callback(err, req, res);
                });
            });            
            
        }
        else {
            console.log('error');
            callback(null, req, res);
        }
    };

    this.getPolls = function(callback) {
        Polls.find({}, function(err, polls) {
            if (err) {
                throw err;
            }
        

            callback(err, polls);
            
        });
    };
    this.getSpecificPoll = function(pNum, callback) {
        Polls.find({number: pNum}, function(err, poll) {
            if (err) {
                throw err;
            }

            callback(err, poll);
            
        });
    };
    this.addVote = function (req, res, callback) {
        console.log(req.params.number);
        console.log(req.query.vote);

		Polls.find({'number': req.params.number}, function(err, poll) {
            if (err) throw err;
            //console.log(poll);
            var newAnswers = poll[0].answers;
            var votedAnswer = decodeURIComponent(req.query.vote).replace("\r","");
            var noMatch = true;
            newAnswers = newAnswers.map(function(val){
                if (val.answer == votedAnswer){
                    noMatch = false;
                    var newVal = parseInt(val.voteNum)+1
                    return {"answer": val.answer, "voteNum": newVal, };
                }
                else return val;
            });
            console.log(newAnswers);
            if(noMatch === false){
                Polls.update({'number': req.params.number}, {$set: {'answers' : newAnswers}}, function(err){if (err) throw err
                
                Polls.find({'number': req.params.number}, function(err, updatedPoll) {
                    if (err) throw err
                    callback(err, updatedPoll);
                });
            });
            }
            else {
                Polls.update({'number': req.params.number}, {$push: {'answers' : {'answer': votedAnswer, 'voteNum': 1}}}, function(err){if (err) throw err
                
                    Polls.find({'number': req.params.number}, function(err, updatedPoll) {
                        if (err) throw err
                        callback(err, updatedPoll);
                    });
                });
            }
                
           
            
        });            
	};
	this.deletePoll = function (req, res, callback) {
        console.log('removing poll# '+req.body.number);

        Polls.remove({number: req.body.number}, function(err, results){
            if (err) throw err;
            callback();
        });
		           
	};
}

module.exports = PollHandler;