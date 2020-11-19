const router = require('express').Router();
const User = require('../models/user');

const authCheck = (req, res, next) => {
	if(!req.user){
		//If User is not logged in
		res.redirect('/auth/login');
	} else {
		next();
	}
}

router.get('/', authCheck, (req, res) => {
	res.json(req.user);
})

module.exports = router;