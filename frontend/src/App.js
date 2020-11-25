import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Flights from './components/flights/flights';
import NavBar from './components/navbar/navbar';
import FlightSearchResults from './components/flightSearchResults/flightSearchResults';
import RegisterNewUser from './components/authentication/authentication';
import Login from './components/login/login';
import ConfirmOrder from './components/confirmOrder/confirmOrder';
import TransactionHistory from './components/transactionHistory/transactionHistory';
import Hotels from './components/hotels/hotels';
import HotelSearchResults from './components/hotelSearchResults/hotelSearchResults';
import ConfirmOrderHotel from './components/confirmOrderHotel/confirmOrderHotel';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component{

  render () {

    return (
      <BrowserRouter>
        <NavBar />
        <Route exact path='/' component={ Flights } />
        <Route path='/hotels' component={ Hotels } />
        <Route path='/flightSearchResults' component={ FlightSearchResults } />
        <Route path='/hotelSearchResults' component={ HotelSearchResults } />
        <Route path='/registerNewUser' component={ RegisterNewUser } />
        <Route path='/login' component={ Login } />
        <Route path='/confirmOrder' component={ ConfirmOrder } />
        <Route path='/confirmOrderHotel' component={ ConfirmOrderHotel } />
        <Route path='/transactionHistory' component={ TransactionHistory } />
      </BrowserRouter>
    )
  }
}

export default App;
