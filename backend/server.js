const express = require('express');

const keys = require('./config/keys')

const flightRoutes = require('./routes/flightRoutes')

const app = express();


app.use('/flights', flightRoutes)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));