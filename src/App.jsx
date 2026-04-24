// src/App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import RandomVariable from "./pages/RandomVariable";
import ProbabilityDistributions from "./pages/ProbabilityDistributions";
import ParameterEstimation from "./pages/ParameterEstimation";
import HypothesisTesting from "./pages/HypothesisTesting";
import Correlation from "./pages/Correlation";
import Anova from "./pages/Anova";

import "./styles/bootstrap.css";
import "./styles/sidebar.css";
import "./styles/theme.css";
import "./styles/scrollToTop.css";

/**
 * @component App
 * @description The root component of the application.
 * It sets up the routing architecture using HashRouter (suitable for static hosting)
 * and defines the main navigation paths. All pages are wrapped within a global
 * Layout component to ensure consistent navigation and styling.
 */
function App() {
  return (
    <Router>
      {/* Global layout wrapper containing Sidebar and Navigation */}
      <Layout>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Home />} />

          {/* Main educational modules */}
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
          <Route path="/anova" element={<Anova />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
