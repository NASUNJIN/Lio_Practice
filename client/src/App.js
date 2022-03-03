import React from 'react';
// This is a React Router v6 app
import {
  BrowserRouter as Router,
  Routes,
  Route, 
  Switch, 
  // Link
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

 

function App() {
  return (
    <Router>
      <div>
        {/*
          A <Switch> looks through all its childeren <Router>
          elements and renders the first one whose path
          matches the Current URL, Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        
        {/* v5 */}
        {/* <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
        </Switch> */}
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>

      </div>
    </Router>
  ); 
}

export default App;

