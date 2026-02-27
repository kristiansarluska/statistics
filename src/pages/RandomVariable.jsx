// src/pages/RandomVariable.jsx
import React from "react";
import ContinuousDiscrete from "./randomVariable/ContinuousDiscrete";
import Distribution from "./randomVariable/Distribution";
import Characteristics from "./randomVariable/Characteristics";

const RandomVariable = () => {
  return (
    <div className="container-fluid content-container">
      <h1 id="random-variable" className="mb-4">
        Náhodná veličina
      </h1>

      <ContinuousDiscrete />

      <Distribution />

      <Characteristics />
    </div>
  );
};

export default RandomVariable;
