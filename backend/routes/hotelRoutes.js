const express = require('express');
const router = express.Router();
const Amadeus = require('amadeus');
const keys = require('../config/keys');

const amadeusCredentials = keys.amadeus;

const amadeus = new Amadeus({
	clientId: amadeusCredentials.clientId,
	clientSecret: amadeusCredentials.clientSecret
})

router.get(`/hotelOffers`, async (req, res) => { 
    var cityCode_      = req.query.cityCode;
    var latitude_      = req.query.latitude;
    var longitude_     = req.query.longitude;
    var hotelIds_      = req.query.hotelIds;
    var checkInDate_   = req.query.checkInDate;
    var roomQuantity_  = req.query.roomQuantity;
    var adults_        = req.query.adults;
    var radius_        = req.query.radius;
    var radiusUnit_    = req.query.radiusUnit;
    var hotelName_     = req.query.hotelName;
    var chains_        = req.query.chains;
    var amenities_     = req.query.amenities;
    var priceRange_    = req.query.priceRange;
    var currency_      = "INR";
    var paymentPolicy_ = req.query.paymentPolicy;
    var includeClosed_ = req.query.includeClosed;
    var bestRateOnly_  = req.query.bestRateOnly;
    var view_          = req.query.view;
    var sort_          = req.query.sort;
    var pageOffset_    = {offset: 1000};
    var pageLimit_     = {limit: 1000};
    var lang_          = req.query.lang;

    

    
    params = {
        cityCode: cityCode_,
        latitude: latitude_,
        longitude: longitude_,
        hotelIds: hotelIds_,
        checkInDate: checkInDate_,
        roomQuantity: roomQuantity_,
        adults: adults_,
        radius: radius_,
        radiusUnit: radiusUnit_,
        hotelName: hotelName_,
        chains: chains_,
        amenities: amenities_,
        priceRange: priceRange_,
        currency: currency_,
        paymentPolicy: paymentPolicy_,
        includeClosed: includeClosed_,
        bestRateOnly: bestRateOnly_,
        view: view_,
        sort: sort_,
        pageOffset: pageOffset_,
        //pageLimit: pageLimit_,
        lang: lang_		
    }

    const response = await amadeus.client.get('/v2/shopping/hotel-offers', params).catch(err => console.log(err))
    
    
    // Get first response to calculate total number of cities
    /*
	const response = await amadeus.referenceData.hotelOffersSearch 
	  .get({ 
        cityCode: cityCode_,
        latitude: latitude_,
        longitude: longitude_,
        hotelIds: hotelIds_,
        checkInDate: checkInDate_,
        roomQuantity: roomQuantity_,
        adults: adults_,
        radius: radius_,
        radiusUnit: radiusUnit_,
        hotelName: hotelName_,
        chains: chains_,
        amenities: amenities_,
        priceRange: priceRange_,
        currency: currency_,
        paymentPolicy: paymentPolicy_,
        includeClosed: includeClosed_,
        bestRateOnly: bestRateOnly_,
        view: view_,
        sort: sort_,
        pageOffset: pageOffset_,
        pageLimit: pageLimit_,
        lang: lang_		
	  })
      .catch((x) => console.log(x)); 
    */
	
	try { 
      await res.json(JSON.parse(response.body)); 
      
	} catch (err) { 
	  await res.json(err); 
	} 
  });


  module.exports = router;