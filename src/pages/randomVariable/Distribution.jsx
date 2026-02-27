// src/pages/randomVariable/Distribution.jsx
import React from "react";
import DiscreteDistributionChart from "../../components/charts/random-variable/distribution/DiscreteDistributionChart";
import ContinuousDistributionChart from "../../components/charts/random-variable/distribution/ContinuousDistributionChart";
import QuantileFunctionSlider from "../../components/charts/random-variable/distribution/QuantileFunctionSlider";
import QuantileFunctionInput from "../../components/charts/random-variable/distribution/QuantileFunctionInput";

const Distribution = () => {
  return (
    <section id="distribution">
      <h2 className="mb-4">Rozdelenie náhodnej veličiny</h2>

      <div id="pmf-pdf" className="mb-5">
        <h3 className="mb-3">Pravdepodobnostná funkcia</h3>
        <p>{/* Placeholder for theoretical content */}</p>
      </div>

      <div id="cdf" className="mb-5">
        <h3 className="mb-3">Distribučná funkcia</h3>
        <p>{/* Placeholder for theoretical content */}</p>
        <ContinuousDistributionChart />
        <DiscreteDistributionChart />
      </div>

      <div id="quantile" className="mb-5">
        <h3 className="mb-3">Kvantilová funkcia</h3>
        <p>{/* Placeholder for theoretical content */}</p>
        <div className="mb-4">
          <QuantileFunctionSlider />
        </div>
        <div>
          <QuantileFunctionInput />
        </div>
      </div>
    </section>
  );
};

export default Distribution;
