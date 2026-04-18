// src/pages/RandomVariable.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import Introduction from "./random-variable/Introduction";
import ContinuousDiscrete from "./random-variable/ContinuousDiscrete";
import Distribution from "./random-variable/Distribution";
import Characteristics from "./random-variable/Characteristics";

function RandomVariable() {
  const { t } = useTranslation();

  return (
    <div className="container-fluid mb-5">
      <h1 id="random-variable" className="mb-4">
        {t("topics.randomVariable")}
      </h1>

      <Introduction />

      <hr className="my-5" />

      <ContinuousDiscrete />

      <hr className="my-5" />

      <Distribution />

      <hr className="my-5" />

      <Characteristics />
    </div>
  );
}

export default RandomVariable;
