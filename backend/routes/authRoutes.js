const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
	res.json(req.user);
})

router.get('/logout', (req, res) => {
	console.log("Logging Out");
	req.logout();
	res.redirect('http://localhost:3000');
})

router.get('/localAuth', passport.authenticate('local'), (req, res) => {
	console.log(res.user)
	res.redirect('http://localhost:3000')
})

router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
	if(req.user.address === "1xx1"){
		res.redirect('http://localhost:3000/auth/login/firstTimeLogin');
	} else {
		res.redirect('http://localhost:3000');
	}
})

module.exports = router;