import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Start from "./pages/Start";
import Admin from "./pages/Admin";
import Dev from "./pages/Dev";

function App() {
  return (
    <>
      <Router>
        <Route path="/" component={Start} exact />
        <Route path="/admin" component={Admin} />
        <Route path="/dev/:room" component={Dev} />
        <Route path="/join/:room" component={Start} />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
