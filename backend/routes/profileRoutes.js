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

router.put('/:id', (req, res) => {
	User.findByIdAndUpdate({_id: req.params.id}, req.body)
		.then(user => {
			res.json(user)
		})
		.catch(err => {
			res.status(404).json({success: false})
		})
})

module.exports = router;