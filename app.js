var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var hbs = require('hbs');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

var mongoose = require('mongoose');
var mongo = require('mongodb');
var monk = require('monk');
var user = require('./routes/user');
var db = monk('localhost:27017/shine_v2');
var User = require('./models/user-model');

var connStr = 'mongodb://localhost:27017/shine_v2';
mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});

// all environments
var port = process.env.PORT || 80;
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.set('view options', {layout: false});

app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.logger('dev'));

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({username: username}, function(err, user) {
			if (err) {return done(err);}
			if (!user) {
				return done(null, false, {message: 'Incorrect username.'});
			}
			user.comparePassword(password, function(err, isMatch) {
				if (err) return done(err);
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/homepage', routes.toPage('homepage'));
app.get('/', user.register);
app.get('/login', user.login);
app.get('/register', user.register);
app.get('/demo', function(req, res) {
	res.sendfile('./views/demo.html');
});
app.get('/settings', routes.toPage('settings'));
app.get('/gamepage', routes.toPage('gamepage'));

app.post('/gamepage', routes.updateScore(db));

app.post('/adduser', routes.adduser(db));
app.post('/login', routes.login(db));
app.get('/loginfail', user.loginfail);
app.post('/changepassword', routes.changepassword(db));
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
});

app.get('/graphscores', function(req, res) {
	User.findOne({ username: req.user.username }, function(error, user) {
		console.log('found user');
		console.log(user.dailyScores);
		res.send(user.dailyScores);
	});
});

app.get('/graphtimes', function(req, res) {
	User.findOne({ username: req.user.username }, function(error, user) {
		console.log('found user');
		console.log(user.dailyTimes);
		res.send(user.dailyTimes);
	});
});
console.log(port)
app.listen(port);
console.log('Running server at '+port);
