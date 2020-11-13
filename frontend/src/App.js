import React, {Component, Link} from 'react';
import Home from './components/home/home';
import {BrowserRouter, Route} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';


class App extends Component{

  render(){
    return(
      <BrowserRouter>
        <div className="App">
          <Home />
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
