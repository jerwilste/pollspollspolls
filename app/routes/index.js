'use strict';

var path = process.cwd();
//var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}

	var pollHandler = new PollHandler();

	app.route('/')
		.get(function (req, res) {
			pollHandler.getPolls(function(err, r){
				if (err) throw err;
				else {
					if (req.user) {
						res.render('../app/views/pages/index', {polls: r, auth: req.isAuthenticated(), user: req.user.github.username, list: req.query.list});
					}
					else {
						res.render('../app/views/pages/index', {polls: r, auth: req.isAuthenticated(), user: null, list: null});
							
					}
				}

			});
		});
	app.route('/poll')
		.get(function (req, res) {
			pollHandler.getPolls(function(err, r){
				if (err) throw err;
				else {
					if (req.user) {
						
						res.render('../app/views/pages/poll', {polls: r, auth: req.isAuthenticated(), user: req.user.github.username, linkedPoll: req.query.number});
					}
					else {
						res.render('../app/views/pages/poll', {polls: r, auth: req.isAuthenticated(), user: null, linkedPoll: req.query.number});
							
					}
				}

			});
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/api/user/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});
		
	app.route('/api/polls/:query')
		.get(function (req, res){
			if (req.params.query === "all"){
				pollHandler.getPolls(function(err, r){
					if (err) throw err;
					else res.json(r);
				});
			} 
			else {
				pollHandler.getSpecificPoll(req.params.query, function(err, r){
					if (err) throw err;
					else res.json(r);	
				});
			}
		});
		
	app.route('/api/polls/add')
		.post(isLoggedIn, function (req,res){
			pollHandler.addPoll(req, res, function(){
				res.redirect('/');
			});
		});
		
	app.route('/api/polls/delete')
		.post(isLoggedIn, function (req,res){
			pollHandler.deletePoll(req, res, function(){
				res.redirect('/');
			});
		});	
		
	app.route('/api/polls/addVote/:number')
		.post(function (req,res){
			pollHandler.addVote(req, res, function(err, r){
				res.json(r);
			});
		});
		
	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/'
		}));

//	app.route('/api/:id/clicks')
//		.get(isLoggedIn, clickHandler.getClicks)
//		.post(isLoggedIn, clickHandler.addClick)
//		.delete(isLoggedIn, clickHandler.resetClicks);
};
