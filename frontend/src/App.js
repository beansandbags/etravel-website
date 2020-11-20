import React, {Component, Link} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Flights from './components/flights/flights';
import NavBar from './components/navbar/navbar';
import FlightSearchResults from './components/flightSearchResults/flightSearchResults';


import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component{

  render () {

    return (
      <BrowserRouter>
        <NavBar />
        <Route exact path='/' component={ Flights } />
        <Route path='/flightSearchResults' component={ FlightSearchResults } />
      </BrowserRouter>
    )
  }
}

export default App;
