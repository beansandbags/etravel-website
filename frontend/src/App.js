import React, {Component, Link} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Flights from './components/flights/flights';
import NavBar from './components/navbar/navbar';
import FlightSearchResults from './components/flightSearchResults/flightSearchResults';
import RegisterNewUser from './components/authentication/authentication';
import Login from './components/login/login';
import ConfirmOrder from './components/confirmOrder/confirmOrder';
import TransactionHistory from './components/transactionHistory/transactionHistory';


import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component{

  render () {

    return (
      <BrowserRouter>
        <NavBar />
        <Route exact path='/' component={ Flights } />
        <Route path='/flightSearchResults' component={ FlightSearchResults } />
        <Route path='/registerNewUser' component={ RegisterNewUser } />
        <Route path='/login' component={ Login } />
        <Route path='/confirmOrder' component={ ConfirmOrder } />
        <Route path='/transactionHistory' component={ TransactionHistory } />
      </BrowserRouter>
    )
  }
}

export default App;
