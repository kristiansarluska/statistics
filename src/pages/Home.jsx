// src/pages/Home.jsx
import React from "react";
import Hero from "./home/Hero";
import About from "./home/About";
import Topics from "./home/Topics";
import Methodology from "./home/Methodology";

/**
 * @component Home
 * @description The main page component for the home section.
 */
function Home() {
  return (
    <div className="container-fluid mb-5">
      <Hero />

      <About />

      <Topics />

      <Methodology />
    </div>
  );
}

export default Home;
