// src/pages/parameterEstimation/IntervalEstimation.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath, BlockMath } from "react-katex";
import ConfidenceIntervalSimulation from "../../components/content/parameterEstimation/ConfidenceIntervalSimulation";

import "katex/dist/katex.min.css";

function IntervalEstimation() {
  const { t } = useTranslation();

  return (
    <section id="interval-estimation" className="mb-5">
      <h2 className="mb-4">
        {t("parameterEstimation.intervalEstimation.title")}
      </h2>

      <p>
        Kým bodový odhad aproximuje neznámy parameter jediným číslom,
        intervalový odhad vymedzuje <strong>interval hodnôt</strong>, v ktorom
        sa parameter nachádza s určitou pravdepodobnosťou{" "}
        <InlineMath math="1 - \alpha" /> (hladina spoľahlivosti).
      </p>

      <p>
        Interval spolehlivosti je dvojica štatistík{" "}
        <InlineMath math="(T_D, T_H)" />, pre ktorú platí:
      </p>

      <div className="text-center overflow-auto mb-4">
        <BlockMath math="P\!\left(T_D \leq \theta \leq T_H\right) = 1 - \alpha" />
      </div>

      <div className="alert alert-info border-info-subtle shadow-sm mb-5">
        <h5 className="alert-heading fs-6 fw-bold">
          Najčastejšia zámena pojmov
        </h5>
        <p className="mb-0 small text-muted">
          Interval spoľahlivosti <strong>nehovorí</strong>, že 95 % dát leží v
          danom intervale. Je to pravdepodobnosť, že{" "}
          <strong>tento konkrétny postup vzorkovania</strong> pri opakovanom
          aplikovaní pokryje skutočnú hodnotu parametra v 95 % prípadov. Ak by
          100 výskumníkov nezávisle odobralo vzorku a vypočítalo 95 % interval,
          zhruba 95 z nich by skutočne pokrylo populačný parameter, 5 by ho
          minulo.
        </p>
      </div>

      {/* CI formula overview */}
      <h4 className="mb-3">Typy intervalov spoľahlivosti</h4>
      <div className="row g-3 mb-5">
        {[
          {
            title: "Ľavostranný",
            math: "\\left(\\bar{x} - z_{1-\\alpha} \\cdot \\frac{\\sigma}{\\sqrt{n}},\\;+\\infty\\right)",
            desc: "Parameter je väčší ako dolná hranica. Testuje sa, či hodnota nie je príliš malá.",
            color: "border-success",
          },
          {
            title: "Obojstranný",
            math: "\\bar{x} \\pm z_{1-\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}",
            desc: "Parameter leží medzi dolnou a hornou hranicou. Najčastejšie používaný typ.",
            color: "border-primary",
          },
          {
            title: "Pravostranný",
            math: "\\left(-\\infty,\\;\\bar{x} + z_{1-\\alpha} \\cdot \\frac{\\sigma}{\\sqrt{n}}\\right)",
            desc: "Parameter je menší ako horná hranica. Testuje sa, či hodnota nie je príliš veľká.",
            color: "border-warning",
          },
        ].map(({ title, math, desc, color }) => (
          <div key={title} className="col-md-4">
            <div className={`card h-100 shadow-sm border-2 ${color}`}>
              <div className="card-body">
                <h6 className="card-title fw-bold">{title}</h6>
                <div
                  className="overflow-auto text-center my-2"
                  style={{ fontSize: "0.9rem" }}
                >
                  <BlockMath math={math} />
                </div>
                <p className="card-text small text-muted mb-0">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p>
        Ak je smerodajná odchýlka populácie <InlineMath math="\sigma" />{" "}
        <strong>neznáma</strong> (bežný prípad v praxi), nahrádzame{" "}
        <InlineMath math="z" />
        -skóre kvantilmi <strong>Studentovho t-rozdelenia</strong> a populačné{" "}
        <InlineMath math="\sigma" /> výberovým <InlineMath math="s" />. Toto
        rozdelenie má ťažšie chvosty (väčšiu neistotu) a s rastúcim{" "}
        <InlineMath math="n" /> konverguje k normálnemu rozdeleniu.
      </p>

      {/* Simulation */}
      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">Interaktívna simulácia intervalu spoľahlivosti</h5>
        <p className="text-muted mb-4 small">
          Simulácia používa rovnaké dáta ako bodový odhad — mediány veku 1 113
          regiónov NUTS3 EÚ (Eurostat 2025), s populačnou strednou hodnotou{" "}
          <strong>μ = 46,22 rokov</strong> a smerodajnou odchýlkou{" "}
          <strong>σ = 3,76 rokov</strong>. Pridávajte výbery a sledujte, koľko
          intervalov skutočne pokryje μ. Po zmene nastavení (hladina, typ, σ) sa{" "}
          <em>všetky existujúce intervaly automaticky prepočítajú</em> — môžete
          tak priamo porovnať, ako nastavenia ovplyvňujú pokryvnosť.
        </p>
        <ConfidenceIntervalSimulation />
      </div>
    </section>
  );
}

export default IntervalEstimation;
