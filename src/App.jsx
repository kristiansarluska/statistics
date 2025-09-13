// src/App.jsx
import React from "react";
import Layout from "./layout/Layout";
import Home from "./pages/Home";

import "./styles/bootstrap.css";
import "./styles/sidebar.css";

function App() {
  return (
    <Layout>
      <Home />
    </Layout>
  );
}

export default App;
