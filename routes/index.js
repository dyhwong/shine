var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var User = require('../models/user-model');

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
}

exports.toPage = function(url) {
    return function(req, res, next) {
  		ensureAuthenticated(req, res, function() {
  			res.render('../views/' + url + '.html', {
  				name: req.user.username,
  				scores: req.user.scores,
  				allTime: req.user.allTime,
  				dayHigh: req.user.dayHigh,
  				monthHigh: req.user.monthHigh,
  				average: req.user.average,
  				count: req.user.count,
  				dailyScores: req.user.dailyScores,
  				dailyTimes: req.user.dailyTimes
  		});
  	});
  }
}

exports.adduser = function(db) {
	return function(req, res, next) {
		console.log(req.body);		/*debugging help*/ 
		var user_ = (req.body.username).replace(/[^\w]/gi, '');
		var validUser = user_.length > 1;
		console.log(user_);

		var addUser = new User({
			username: user_,
			password: req.body.password,
			allTime: 0,
			dayHigh: 0,
			monthHigh: 0,
			average: 0,
			count: 0
		});
        
		var password = req.body.password;
		var confirmPass = req.body.confirm;
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var validPass = password.length > 1;

		var collection = db.get('users');

		User.findOne({username: user_}, function(err, user) {
		if  (validUser){
			if (user === null) {
				if (confirmPass === password && validPass) {
					if (user_.length < 15) {
						addUser.save(function(err) {
							collection.insert(addUser, function(err, doc) {
								console.log('user added');
								passport.authenticate('local', function(err, user, info) {
									console.log(req.body);
									if (err) { 										
										console.log('Invalid user');
						            	res.location('/');
						            	res.render('homepage.html', {'error': true, 'login': false, 'register':true, 'message': 'invalid username'});
						            }
									if (!user) {
										console.log('Invalid user');
						            	res.location('/');
						            	res.render('homepage.html', {'error': true, 'login': false, 'register':true, 'message': 'invalid username'});
						 			}
									req.logIn(user, function(err) {
										if (err) { return next(err); }
										console.log('welcome!');
										return res.redirect('/settings');
									});
								})(req, res, next);
							});
						});	
					} else {
						console.log('username too long');
						res.location('/');
						res.render('homepage.html', {'error': true, 'login': false, 'register':true, 'message': 'invalid username'});					
					}		
				} else {
					console.log('password confirmation did not match');
					res.location('/');
					res.render('homepage.html', {'error': true, 'login': false, 'register':true, 'message': 'invalid password'});
					
				}
			} else {
				console.log('username already exists, pick another');
				res.location('/');
				res.render('homepage.html', {'error': true, 'login': false, 'register':true, 'message': 'invalid username'});
			}
		} else {
			console.log('invalid username');
			res.location('/');
			res.render('homepage.html', {'error': true, 'login': false, 'register':true, 'message': 'invalid username'});
			}

		});
	}
}

exports.login = function(db) {
	return function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			console.log(req.body);
			if (err) { return next(err) }
			if (!user) {
				console.log('not a user');
				return res.redirect('/loginfail');
			}
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				console.log('welcome!');
				return res.redirect('/settings');
			});
		})(req, res, next);
	}
}

exports.changepassword = function(db) {
	return function(req, res) {
		var oldPass = req.body.oldpassword;
		var newPass = req.body.newpassword;
		var confirm = req.body.confirm;

		var collection = db.get('users');

		req.user.comparePassword(oldPass, function(err, isMatch) {
			if (err) throw err;
			if (isMatch) {
				if (newPass === confirm) {
					bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash(newPass, salt, function(){}, function(err, hash) {
							collection.update({ username: req.user.username }, { $set: { password: hash } });
							if (req.user.password = hash) {
								console.log('password changed');
							}
							res.redirect('/settings');
						});						
					});
				}
			}
		});
	}
}

exports.updateScore = function(db) {
	return function(req, res) {
		var collection = db.get('users');
		var newScore = req.body['score'];
		var timeStamp = req.body["timeStamp"];
		var newTime = req.body['timePlayed'];

		//adds score to list of scores
		collection.update({ username: req.user.username }, { $push: { scores: {score: newScore, time: timeStamp} } });
		console.log('score updated: new score added');

		//updates times played
		var timesPlayed = req.user.scores.length + 1;
		collection.update({ username: req.user.username }, { $set: { count: timesPlayed } });

		//updates all time high score
		if (newScore > req.user.allTime) {
			collection.update({ username: req.user.username }, { $set: { allTime: newScore } });
		}

		var currentDate = timeStamp.split('/');

		//updates day high score
		var day = Number(newScore);
		if (req.user.scores.length === 0) {
			collection.update({ username: req.user.username }, { $set: { dayHigh: day } });
			console.log('collection updated');
		}
		for (var i = 0; i < req.user.scores.length; i++) {
			if (currentDate[0] === req.user.scores[i].time.split('/')[0]) {
				if (currentDate[1] === req.user.scores[i].time.split('/')[1]) {
					if (currentDate[2].split(' ')[0] === req.user.scores[i].time.split('/')[2].split(' ')[0]) {
						if (Number(req.user.scores[i].score) > day) {
							day = Number(req.user.scores[i].score);
						}
						if (i === req.user.scores.length - 1) {
							collection.update({ username: req.user.username }, { $set: { dayHigh: day } });
						}
					}
				}
			}
		}

		//updates month high score
		var month = Number(newScore);
		if (req.user.scores.length === 0) {
			collection.update({ username: req.user.username }, { $set: { monthHigh: month } });
		}
		for (var i = 0; i < req.user.scores.length; i++) {
			if (currentDate[0] === req.user.scores[i].time.split('/')[0]) {
				if (currentDate[2].split(' ')[0] === req.user.scores[i].time.split('/')[2].split(' ')[0]) {
					if (Number(req.user.scores[i].score) > month) {
						month = Number(req.user.scores[i].score);
					}
					if (i === req.user.scores.length - 1) {
						collection.update({ username: req.user.username }, { $set: { monthHigh: month } });
					}
				}
			}
		}

		//updates average score
		var totalScore = Number(newScore)
		if (req.user.scores.length === 0) {
			collection.update({ username: req.user.username }, { $set: { average: totalScore } });
		}
		for (var i = 0; i < req.user.scores.length; i++) {
			totalScore += Number(req.user.scores[i].score)
			if (i === req.user.scores.length - 1) {
				averageScore = Math.round(totalScore / (req.user.scores.length + 1));
				collection.update({ username: req.user.username }, { $set: { average: averageScore } });
			}
		}

		//updates daily score and daily time
		var latestScore = Number(newScore);
		var latestTime = Number(newTime);
		if (req.user.scores.length === 0) {
			collection.update({ username: req.user.username }, { $push: { dailyScores: latestScore } });
			collection.update({ username: req.user.username }, { $push: { dailyTimes: latestTime } });
		} else {
			if (currentDate[0] === req.user.scores[req.user.scores.length - 1].time.split('/')[0]) {
				console.log('month');
				if (currentDate[1] === req.user.scores[req.user.scores.length - 1].time.split('/')[1]) {
					console.log('day');
					if (currentDate[2].split(' ')[0] === req.user.scores[req.user.scores.length - 1].time.split('/')[2].split(' ')[0]) {
						console.log('year');
						console.log(req.user.dailyScores);
						latestScore += Number(req.user.dailyScores[req.user.dailyScores.length - 1]);
						console.log(latestScore);
						latestTime += Number(req.user.dailyTimes[req.user.dailyTimes.length - 1]);
						console.log(latestTime);
						collection.update({ username: req.user.username }, { $pop: { dailyScores: 1 } });
						collection.update({ username: req.user.username }, { $push: { dailyScores: latestScore } });
						collection.update({ username: req.user.username }, { $pop: { dailyTimes: 1 } });
						collection.update({ username: req.user.username }, { $push: { dailyTimes: latestTime } });
					} else {
						collection.update({ username: req.user.username }, { $push: { dailyScores: latestScore } });
						collection.update({ username: req.user.username }, { $push: { dailyTimes: latestTime } });
					}
				} else {
					collection.update({ username: req.user.username }, { $push: { dailyScores: latestScore } });
					collection.update({ username: req.user.username }, { $push: { dailyTimes: latestTime } });
				}
			} else {
				collection.update({ username: req.user.username }, { $push: { dailyScores: latestScore } });
				collection.update({ username: req.user.username }, { $push: { dailyTimes: latestTime } });
			}
		}
	}
}

