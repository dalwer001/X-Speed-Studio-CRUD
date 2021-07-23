import React from "react";
import axios from "axios";

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";



import Create from "./Components/Create/Create";
import Home from "./Components/Home/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import Update from "./Components/Update/Update";

axios.defaults.baseURL = "http://localhost/api";


function App() {
  return (
    
    <Router>
      <Navbar/>
      <Switch>

        <Route exact path="/">
            <Home/>
        </Route>

        <Route path="/home">
          <Home/>
        </Route>

        <Route path="/create">
          <Create/>
        </Route>

        <Route path="/update">
          <Update/>
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
