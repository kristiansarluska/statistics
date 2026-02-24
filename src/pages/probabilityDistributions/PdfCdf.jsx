// src/pages/probabilityDistributions/PdfCdf.jsx
import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import ContinuousDistributionChart from "../../components/charts/ContinuousDistributionChart";
import DiscreteDistributionChart from "../../components/charts/DiscreteDistributionChart";

function PdfCdf() {
  const sampleDiscreteData = [
    { x: 0, p: 0.03125 },
    { x: 1, p: 0.15625 },
    { x: 2, p: 0.3125 },
    { x: 3, p: 0.3125 },
    { x: 4, p: 0.15625 },
    { x: 5, p: 0.03125 },
  ];

  return (
    <>
      <h2 id="pdf-cdf">Pravdepodobnostná a distribučná funkcia</h2>
      <p>
        Pravdepodobnostné rozdelenie môžeme opísať dvoma príbuznými funkciami:
        <strong> funkciou hustoty pravdepodobnosti (PDF)</strong> a{" "}
        <strong>distribučnou funkciou (CDF)</strong>. Tieto dve zložky spolu
        úzko súvisia — CDF je integrálom PDF.
      </p>
      <p>
        <strong>Funkcia hustoty pravdepodobnosti (PDF)</strong> – označovaná ako{" "}
        <InlineMath math="f(x)" /> – udáva, ako sú hodnoty náhodnej veličiny
        rozložené. Nie je to samotná pravdepodobnosť, ale platí:
      </p>
      <BlockMath math="P(a \leq X \leq b) = \int_a^b f(x)\,dx" />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pulvinar
        pharetra enim, sit amet cursus mi ultrices ut. Suspendisse sed leo
        porttitor, bibendum eros ut, vehicula nulla.
      </p>
      <p>
        <strong>Distribučná funkcia (CDF)</strong> – označovaná ako{" "}
        <InlineMath math="F(x)" /> – vyjadruje, aká je pravdepodobnosť, že
        náhodná veličina nadobudne hodnotu menšiu alebo rovnakú ako{" "}
        <InlineMath math="x" />:
      </p>
      <BlockMath math="F(x) = P(X \leq x) = \int_{-\infty}^{x} f(t)\,dt" />
      <p>
        Táto funkcia má tvar postupne rastúcej (sigmoidnej) krivky, ktorá sa
        asymptoticky približuje k 1. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Pellentesque habitant morbi tristique senectus et netus
        et malesuada fames ac turpis egestas.
      </p>

      <div id="pdf-cdf-example">
        {/* STATICKÉ HODNOTY NATVRDO */}
        <ContinuousDistributionChart mean={0} sd={1} />
      </div>

      <div id="pdf-cdf-example-discrete">
        <DiscreteDistributionChart data={sampleDiscreteData} />
      </div>
    </>
  );
}

export default PdfCdf;
