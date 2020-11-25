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
							cityCountryString: pageResponse.data[y].address.cityName + ", " + pageResponse.data[y].address.countryName,	
							codeCity: pageResponse.data[y].address.cityCode,
							codeCountry: pageResponse.data[y].address.countryCode,
							iata: pageResponse.data[y].iataCode,
							id: pageResponse.data[y].id,
							href: pageResponse.data[y].self.href,
							name: pageResponse.data[y].name,
							coordinates: {lat: pageResponse.data[y].geoCode.latitude, lng: pageResponse.data[y].geoCode.longitude}
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

  router.get('/hotelOffers', async (req, res) => {
	  cityCode_ 	= req.query.cityCode
	  checkInDate_ 	= req.query.checkInDate
	  checkOutDate_	= req.query.checkOutDate
	  adults_		= req.query.adults
	  radius_		= req.query.radius
	  radiusUnit_ 	= req.query.radiusUnit
	  roomQuantity_	= req.query.roomQuantity
	  currency_		= req.query.currency
	  pageOffset_	= req.query.pageOffset*10
	  const response = await amadeus.shopping.hotelOffers
	  		.get({
				  cityCode: cityCode_,
				  checkInDate: checkInDate_,
				  checkOutDate: checkOutDate_,
				  adults: adults_,
				  radius: radius_,
				  radiusUnit: radiusUnit_,
				  currency: currency_,
			  })
			.catch((e) => console.log(e))
	  try {
		  await res.json({count: response.result.data.length, hotels: response.result.data});
	  } catch(err) {
		  await res.json(err);
	  }
  })


module.exports = router;