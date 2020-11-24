const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys')
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoDBStore = require('connect-mongodb-session')(session);

const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');

const flightRoutes = require('./routes/flightRoutes');
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const localAuthRoutes = require('./routes/user')

const passportSetup = require('./config/passport-setup')


const app = express();

app.use(cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

const db = keys.mongoURI;

mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const mongoDBstore = new MongoDBStore({
  uri: db,
  collection: "adsoniSessions"
})


app.use(session({
  name: "adsoni",
  secret: "adsoni",
  resave: false,
  saveUninitialized: true,
  store: mongoDBstore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 3,
    sameSite: false,
    secure: false,
  }
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize())
app.use(passport.session())


app.use('/flights', flightRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/hotels', hotelRoutes);
app.use('/localAuth', localAuthRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));