const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys');
const User = require('../models/user');

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	})
})

passport.use(
	new LocalStrategy(
		function(username, password, done){
			User.findOne({email: username}, function(err, user) {
				if(err){ return done(err)}
				if(!user) {return done(null, false)}
				if(user.password != password){ return cb(null, false); }
				return done(null, user);  
			})
		}
	)
)

passport.use(
	new GoogleStrategy({
		callbackURL: '/auth/google/redirect',
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret
	}, (accessToken, refreshToken, profile, email, done) => {
		User.findOne({googleID:email.id}).then((currentUser) => {
			if(currentUser){
				console.log('User is: ', currentUser)
				done(null, currentUser);
			} else {
				new User({
					name: email.displayName,
					googleID: email.id,
					photo: email.photos[0].value,
					email: email.emails[0].value
				}).save().then((newUser) => {
					console.log('New User Created: ', newUser);
					done(null, newUser);
				})
			}
		})
	})
)