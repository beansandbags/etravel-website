const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys')
const session = require('express-session');
const bodyParser = require('body-parser');

const cors = require('cors')
const passport = require('passport')
const cookieSession = require('cookie-session');

const flightRoutes = require('./routes/flightRoutes')
const profileRoutes = require('./routes/profileRoutes')
const authRoutes = require('./routes/authRoutes')

const passportSetup = require('./config/passport-setup')


const app = express();

app.use(cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

app.use(session({
  secret: "adsoni",
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize())
app.use(passport.session())

const db = keys.mongoURI;

mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use('/flights', flightRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));