const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
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
	new GoogleStrategy({
		callbackURL: '/auth/google/redirect',
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret
	}, (accessToken, refreshToken, profile, email, done) => {
		console.log(email)
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