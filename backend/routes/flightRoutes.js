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
	var keywords = req.query.cityName; 
	// Get first response to calculate total number of cities
	const response = await amadeus.referenceData.locations 
	  .get({ 
		keyword: keywords, 
		subType: "CITY", 
	  })
	  .catch((x) => console.log(x)); 
	//Total Number of Cities
	var totalResponses = response.result.meta.count
	//Total Number of Pages
	var totalPages = Math.ceil(totalResponses/10)
	var cityData = [];
	// For loop gets every single page
	for(var x = 0; x < totalPages; x++){
		var pageResponse = await amadeus.referenceData.locations
			.get({
				keyword: keywords,
				subType: "CITY",
				page: { offset: x*10 }
			})
			.then(function(pageResponse){
				for(var y = 0; y < 10; y++){
					//var currentCity = pageResponse.data[y]
					if(pageResponse.data[y] != null){
						var currentCity = {
							nameCity: pageResponse.data[y].address.cityName,
							nameCountry: pageResponse.data[y].address.countryName,
							codeCity: pageResponse.data[y].address.cityCode,
							codeCountry: pageResponse.data[y].address.countryCode,
							iata: pageResponse.data[y].iataCode,
							id: pageResponse.data[y].id,
							href: pageResponse.data[y].self.href,
							name: pageResponse.data[y].name
						}
						cityData.push(currentCity)
					}
				}
			})
			.catch((x) => console.log(x));
	}
	try { 
	  await res.json({count: totalResponses, cityData}); 
	} catch (err) { 
	  await res.json(err); 
	} 
  });


  router.get(`/flightOffers`, async (req, res) => {
	originLocationCode_      = req.query.depart
	destinationLocationCode_ = req.query.arrive
	departureDate_           = req.query.departDate
	returnDate_              = req.query.returnDate
	adults_                  = req.query.adults
	children_				 = req.query.children
	infants_				 = req.query.infants
	travelClass_			 = req.query.travelClass
	const response = await amadeus.shopping.flightOffersSearch
		.get({
			originLocationCode: originLocationCode_,
			destinationLocationCode: destinationLocationCode_,
			departureDate: departureDate_,
			returnDate: returnDate_,
			adults: adults_,
			children: children_,
			infants: infants_,
			travelClass: travelClass_,
			currencyCode: "INR"
		})
		.catch((e) => console.log(e))
	  try {
		await res.json({count: response.result.meta.count, offersData: response.result.data, dictionary: response.result.dictionaries});
	  } catch (err) {
		await res.json(err);
	  }
  });
 

  module.exports = router;