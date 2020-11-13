const express = require('express');

const keys = require('./config/keys')

const Amadeus = require('amadeus');

const flightRoutes = require('./routes/flightRoutes')

const app = express();

const amadeusCredentials = keys.amadeus;

const amadeus = new Amadeus({
	clientId: amadeusCredentials.clientId,
	clientSecret: amadeusCredentials.clientSecret
})

app.use('/flights', )