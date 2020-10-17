import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


import React from 'react';
import './App.scss';


import Menu from './Menu/Menu'
import Hero from './Hero/Hero'
import HomePage from './HomePage/HomePage'
import Footer from './Footer/Footer'
import AboutPage from "./AboutPage/AboutPage";
import LoginPage from "./LoginPage/LoginPage";


function App() {
  return (
    <Router>
      <Menu></Menu>
      <Hero></Hero>
      <div className = "mainContainer">
          <Switch>
              <Route path="/about">
                  <AboutPage></AboutPage>
              </Route>
              <Route path="/login">
                  <LoginPage></LoginPage>
              </Route>
              <Route path="/">
                  <HomePage></HomePage>
              </Route>
          </Switch>
      </div>
      <Footer></Footer>
    </Router>
  );
}

export default App;
