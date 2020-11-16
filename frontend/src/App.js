import React, {Component, Link} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';



import Flights from './components/flights/flights';
import NavBar from './components/navbar/navbar';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component{

  render () {

    return (
      <BrowserRouter>
        <NavBar />
        <Flights />
      </BrowserRouter>
    )
  }
}

export default App;
