import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';



import Flights from './components/flights/flights';
import NavBar from './components/navbar/navbar';
import RegisterNewUser from './components/authentication/authentication';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


class App extends Component{

  render () {

    return (
      <BrowserRouter>
        <NavBar />
        <Route exact path='/' component={ Flights } />
        <Route path='/registerNewUser' component={ RegisterNewUser } />
      </BrowserRouter>
    )
  }
}

export default App;
