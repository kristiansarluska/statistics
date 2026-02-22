import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import NormalDistributionChart from "../../components/charts/NormalDistributionChart";
import NormalCDFChart from "../../components/charts/NormalCDFChart";
import CSVDistributions from "../../components/charts/CSVDistributions";
import ChiSquareChart from "../../components/charts/ChiSquareChart";

function ContinuousDistributions({
  mean,
  meanInput,
  setMeanValue,
  validateMean,
  sd,
  sdInput,
  setSdValue,
  validateSd,
  hoverX,
  setHoverX,
}) {
  return (
    <>
      <h2 id="continuous-distributions">Spojité rozdelenia</h2>
      <p>Placeholder text o spojitých pravdepodobnostných rozdeleniach.</p>

      <h3 id="exponential">Exponenciálne rozdelenie</h3>
      <p>Placeholder text pre exponenciálne rozdelenie.</p>

      <h3 id="normal">Normálne rozdelenie</h3>
      <p>
        Placeholder text pre normálne rozdelenie. Uvedený tvar hustoty
        pravdepodobnosti je:
      </p>
      <BlockMath math="f(x) = \frac{1}{\sigma \sqrt{2\pi}} e^{ -\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2 }" />
      <p>
        kde <InlineMath math="\mu" /> je stredná hodnota a{" "}
        <InlineMath math="\sigma" /> smerodajná odchýlka.
      </p>

      <div className="controls">
        <label>
          μ (stred):
          <input
            type="number"
            value={meanInput}
            step="0.5"
            onChange={(e) => setMeanValue(e.target.value, validateMean)}
          />
        </label>
        <label>
          σ (smerodajná odchýlka):
          <input
            type="number"
            value={sdInput}
            step="0.1"
            min="0.1"
            onChange={(e) => setSdValue(e.target.value, validateSd)}
          />
        </label>
      </div>

      <div className="charts-wrapper">
        <NormalDistributionChart
          mean={mean}
          sd={sd}
          hoverX={hoverX}
          setHoverX={setHoverX}
        />
        <NormalCDFChart
          mean={mean}
          sd={sd}
          hoverX={hoverX}
          setHoverX={setHoverX}
        />
      </div>

      <CSVDistributions />

      <h4 id="chi-square">Chí kvadrát rozdelenie</h4>
      <p>
        Chí kvadrát rozdelenie s k stupňami voľnosti vzniká ako súčet štvorcov k
        nezávislých náhodných veličín, ktoré majú štandardizované normálne
        rozdelenie N(0, 1). Používa sa napríklad pri teste dobrej zhody, teste
        nezávislosti v kontingenčných tabuľkách alebo pri odhade rozptylu
        normálneho rozdelenia.
      </p>
      <p>Hustota pravdepodobnosti ($\chi^2(k)$) je daná vzorcom:</p>
      <BlockMath math="f(x; k) = \frac{1}{2^{k/2} \Gamma(k/2)} x^{k/2 - 1} e^{-x/2}, \quad x > 0" />
      <p>
        kde k je počet stupňov voľnosti a Gamma$ je Gamma funkcia. Tvar
        rozdelenia závisí od počtu stupňov voľnosti k. Pre malé k je rozdelenie
        výrazne pravostranne zošikmené, s rastúcim k sa približuje k normálnemu
        rozdeleniu.
      </p>

      <div className="charts-wrapper justify-content-center">
        <ChiSquareChart />
      </div>

      <h4 id="student-t">Studentovo t rozdelenie</h4>
      <p>Placeholder text pre Studentovo t rozdelenie.</p>

      <h4 id="fisher-f">Fisherovo F rozdelenie</h4>
      <p>Placeholder text pre Fisherovo F rozdelenie.</p>
    </>
  );
}

export default ContinuousDistributions;
