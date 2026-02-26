// src/pages/randomVariable/QuantileFunction.jsx
import React from "react";
import QuantileFunctionInput from "../../components/charts/random-variable/quantile-function/QuantileFunctionInput";
import QuantileFunctionSlider from "../../components/charts/random-variable/quantile-function/QuantileFunctionSlider";

const QuantileFunction = () => {
  return (
    <section className="mt-5">
      <h2 id="quantile-function" className="mb-4">
        Kvantilová funkcia
      </h2>

      <div className="mb-4">
        <p>
          Kvantilová funkcia priraďuje každej pravdepodobnosti $p \in (0, 1)$
          takú hodnotu $x_p$ (kvantil), pre ktorú platí, že pravdepodobnosť
          nadobudnutia hodnôt menších alebo rovných $x_p$ je práve $p$.
          Zjednodušene ide o inverznú funkciu k distribučnej funkcii.
        </p>
        <ul>
          <li>
            <strong>Medián ($x_{0.5}$):</strong> Rozdeľuje dáta na dve rovnaké
            polovice.
          </li>
          <li>
            <strong>Kvartily:</strong> Rozdeľujú dáta na štvrtiny ($x_{0.25}$,
            $x_{0.5}$, $x_{0.75}$).
          </li>
          <li>
            <strong>Decily:</strong> Rozdeľujú dáta na desať rovnakých častí.
          </li>
        </ul>
      </div>

      <QuantileFunctionInput />

      <QuantileFunctionSlider />
    </section>
  );
};

export default QuantileFunction;
