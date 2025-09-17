// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import RandomVariable from "./pages/RandomVariable";
import ProbabilityDistributions from "./pages/ProbabilityDistributions";
import ParameterEstimation from "./pages/ParameterEstimation";
import HypothesisTesting from "./pages/HypothesisTesting";
import Correlation from "./pages/Correlation";
import SpatialAutocorrelation from "./pages/SpatialAutocorrelation";
import Regression from "./pages/Regression";

import "./styles/bootstrap.css";
import "./styles/sidebar.css";
import "./styles/theme.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/random-variable" element={<RandomVariable />} />
          <Route
            path="/probability-distributions"
            element={<ProbabilityDistributions />}
          />
          <Route
            path="/parameter-estimation"
            element={<ParameterEstimation />}
          />
          <Route path="/hypothesis-testing" element={<HypothesisTesting />} />
          <Route path="/correlation" element={<Correlation />} />
          <Route
            path="/spatial-autocorrelation"
            element={<SpatialAutocorrelation />}
          />
          <Route path="/regression" element={<Regression />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
