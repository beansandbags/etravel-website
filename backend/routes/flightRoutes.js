const express = require('express');
const router = express.Router();
const Amadeus = require('amadeus');
const keys = require('../config/keys');

const amadeusCredentials = keys.amadeus;

const amadeus = new Amadeus({
	clientId: amadeusCredentials.clientId,
	clientSecret: amadeusCredentials.clientSecret
})

router.get(`/citySearch`, async (req, res) => { 
	console.log(req.query); 
	var keywords = req.query.keyword; 
	const response = await amadeus.referenceData.locations 
	  .get({ 
		keyword: keywords, 
		subType: "CITY,AIRPORT", 
		"page[offset]": page * 10
	  })
	  .catch((x) => console.log(x)); 
	try { 
	  await res.json(JSON.parse(response.body)); 
	} catch (err) { 
	  await res.json(err); 
	} 
  });

router.get(`/cities`, async (req, res) => {
	var key = req.query.cityName
	// API call with params we requested from client app
	const response = await amadeus.client.get("/v1/reference-data/locations", {
		keyword: key,
		subType: "CITY"
	})
	.catch((err) => console.log(err));
	// Sending response for client
	try {
	  await res.json(JSON.parse(response.body));
	} catch (err) {
	  await res.json(err);
	}
  });


  module.exports = router;