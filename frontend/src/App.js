import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";

import Start from "./pages/Start";
import Admin from "./pages/Admin";
import Dev from "./pages/Dev";

function App() {
  return (
    <Router>
      <Route path="/" component={Start} exact />
      <Route path="/admin" component={Admin} />
      <Route path="/dev/:room" component={Dev} />
    </Router>
  );
}

export default App;
