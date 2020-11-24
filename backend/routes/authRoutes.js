const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');


router.get('/login', (req, res) => {
	res.json(req.user);
})

router.get('/logout', (req, res) => {
	console.log("Logging Out");
	req.logout();
	res.redirect('http://localhost:3000');
})

router.post('/createNewUser', (req, res) => {
	console.log(req.body.params)
	User.findOne({ email: req.body.params.email }).then(user => {
		if(user){
			console.log("User already exists")
		} if(!user){
			const newUser = new User({
				name: req.body.params.name,
				email: req.body.params.email,
				password: req.body.params.password
			})
			newUser.save().then(newUserCreated => res.json(newUserCreated))
		}
	})	
})

router.post('/localAuth', function(req, res, next) { passport.authenticate('local', (err, user) => {
	console.log(err)
	console.log("1", user)
	if (err) {
		return next(err)
	}
	if(!user){
		console.log("NO USER")
	}
	req.logIn(user, function(err){
		if(err) {
			return next(err)
		}
		console.log("HERE")
		res.json({success: true})
	})
})(req, res, next);
})

router.post('/localRedirect', passport.authenticate('local'), (req, res) => {
	console.log("yy ", req.user)
	//res.redirect('http://localhost:3000')
	res.json({success: true})
})

router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
	console.log("inside google redirect")
	if(req.user.address === "1xx1"){
		res.redirect('http://localhost:3000/auth/login/firstTimeLogin');
	} else {
		res.redirect('http://localhost:3000');
	}
})

module.exports = router;