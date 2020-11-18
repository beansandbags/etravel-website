const express = require('express');

const keys = require('./config/keys')

const cors = require('cors')

const flightRoutes = require('./routes/flightRoutes')

const app = express();

app.use(cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

app.use('/flights', flightRoutes)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));