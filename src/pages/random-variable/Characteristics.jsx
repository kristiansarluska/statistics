// src/pages/randomVariable/Characteristics.jsx
import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import { useTranslation, Trans } from "react-i18next";
import ArithmeticMeanCalc from "../../components/content/characteristics/ArithmeticMeanCalc";
import HarmonicMeanCalc from "../../components/content/characteristics/HarmonicMeanCalc";
import GeometricMeanCalc from "../../components/content/characteristics/GeometricMeanCalc";
import WeightedMeanCalc from "../../components/content/characteristics/WeightedMeanCalc";
import ModeCalc from "../../components/content/characteristics/ModeCalc";
import MedianCalc from "../../components/content/characteristics/MedianCalc";
import RangeCalc from "../../components/content/characteristics/RangeCalc";
import MeanDeviationCalc from "../../components/content/characteristics/MeanDeviationCalc";
import MeanDifferenceCalc from "../../components/content/characteristics/MeanDifferenceCalc";
import VarianceCalc from "../../components/content/characteristics/VarianceCalc";
import StandardDeviationCalc from "../../components/content/characteristics/StandardDeviationCalc";
import CoefficientOfVariationCalc from "../../components/content/characteristics/CoefficientOfVariationCalc";
import QuartileDeviationCalc from "../../components/content/characteristics/QuartileDeviationCalc";
import SkewnessChart from "../../components/charts/random-variable/characteristics/SkewnessChart";
import KurtosisChart from "../../components/charts/random-variable/characteristics/KurtosisChart";
import FiveNumberSummaryBoxplot from "../../components/charts/random-variable/characteristics/FiveNumberSummaryBoxplot";

export function Characteristics() {
  const { t } = useTranslation();

  return (
    <section id="characteristics" className="mb-5">
      <h2 className="mb-4 fw-bold">
        {t("randomVariable.characteristics.title")}
      </h2>
      <p className="mb-5">{t("randomVariable.characteristics.description")}</p>

      {/* LOCATION */}
      <div id="location" className="mb-5">
        <h3 className="mb-3">
          {t("randomVariable.characteristics.location.title")}
        </h3>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.location.description"
            components={{ m: <InlineMath math="x" /> }}
          />
        </p>

        {/* Arithmetic Mean */}
        <h4 className="mb-3">
          {t("randomVariable.characteristics.location.arithmeticMean.title")}
        </h4>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.location.arithmeticMean.description"
            components={{
              m1: <InlineMath math="\bar{x}" />,
              m2: <InlineMath math="\mu" />,
            }}
          />
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t(
              "randomVariable.characteristics.location.arithmeticMean.exampleTitle",
            )}
          </h5>
          <p className="text-muted mb-4 small">
            {t(
              "randomVariable.characteristics.location.arithmeticMean.exampleDesc",
            )}
          </p>
          <ArithmeticMeanCalc />
        </div>

        {/* Harmonic Mean */}
        <h4 className="mb-3">
          {t("randomVariable.characteristics.location.harmonicMean.title")}
        </h4>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.location.harmonicMean.description"
            components={{ m: <InlineMath math="\bar{x}_h" /> }}
          />
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t(
              "randomVariable.characteristics.location.harmonicMean.exampleTitle",
            )}
          </h5>
          <p className="text-muted mb-4 small">
            {t(
              "randomVariable.characteristics.location.harmonicMean.exampleDesc",
            )}
          </p>
          <HarmonicMeanCalc />
        </div>

        {/* Geometric Mean */}
        <h4 className="mb-3">
          {t("randomVariable.characteristics.location.geometricMean.title")}
        </h4>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.location.geometricMean.description"
            components={{
              m: <InlineMath math="\bar{x}_g" />,
              bold: <strong />,
            }}
          />
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t(
              "randomVariable.characteristics.location.geometricMean.exampleTitle",
            )}
          </h5>
          <p className="text-muted mb-4 small">
            {t(
              "randomVariable.characteristics.location.geometricMean.exampleDesc",
            )}
          </p>
          <GeometricMeanCalc />
        </div>

        {/* Weighted Mean */}
        <h4 className="mb-3">
          {t("randomVariable.characteristics.location.weightedMean.title")}
        </h4>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.location.weightedMean.description"
            components={{
              m1: <InlineMath math="\bar{x}_w" />,
              m2: <InlineMath math="w_i" />,
            }}
          />
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t(
              "randomVariable.characteristics.location.weightedMean.exampleTitle",
            )}
          </h5>
          <p className="text-muted mb-4 small">
            {t(
              "randomVariable.characteristics.location.weightedMean.exampleDesc",
            )}
          </p>
          <WeightedMeanCalc />
        </div>

        {/* Mode */}
        <h3 className="mb-3">
          {t("randomVariable.characteristics.location.mode.title")}
        </h3>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.location.mode.description"
            components={{ m: <InlineMath math="\hat{x}" /> }}
          />
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t("randomVariable.characteristics.location.mode.exampleTitle")}
          </h5>
          <p className="text-muted mb-4 small">
            {t("randomVariable.characteristics.location.mode.exampleDesc")}
          </p>
          <ModeCalc />
        </div>

        {/* Median */}
        <h3 className="mb-3">
          {t("randomVariable.characteristics.location.median.title")}
        </h3>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.location.median.description"
            components={{ m: <InlineMath math="\tilde{x}" /> }}
          />
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t("randomVariable.characteristics.location.median.exampleTitle")}
          </h5>
          <p className="text-muted mb-4 small">
            <Trans
              i18nKey="randomVariable.characteristics.location.median.exampleDesc"
              components={{ bold: <strong /> }}
            />
          </p>
          <MedianCalc />
        </div>
      </div>

      {/* VARIABILITY */}
      <div id="variability" className="mb-5">
        <h3 className="mb-3">
          {t("randomVariable.characteristics.variability.title")}
        </h3>
        <p className="mb-4">
          {t("randomVariable.characteristics.variability.description")}
        </p>

        {/* Range */}
        <h4 className="mb-3">
          {t("randomVariable.characteristics.variability.range.title")}
        </h4>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.variability.range.description"
            components={{ m: <InlineMath math="R" /> }}
          />
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t("randomVariable.characteristics.variability.range.exampleTitle")}
          </h5>
          <p className="text-muted mb-4 small">
            {t("randomVariable.characteristics.variability.range.exampleDesc")}
          </p>
          <RangeCalc />
        </div>

        {/* Mean Deviation */}
        <h4 className="mb-3">
          {t("randomVariable.characteristics.variability.meanDeviation.title")}
        </h4>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.variability.meanDeviation.description"
            components={{ m: <InlineMath math="\bar{d}_{\bar{x}}" /> }}
          />
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t(
              "randomVariable.characteristics.variability.meanDeviation.exampleTitle",
            )}
          </h5>
          <p className="text-muted mb-4 small">
            {t(
              "randomVariable.characteristics.variability.meanDeviation.exampleDesc",
            )}
          </p>
          <MeanDeviationCalc />
        </div>

        {/* Mean Difference */}
        <h4 className="mb-3">
          {t("randomVariable.characteristics.variability.meanDifference.title")}
        </h4>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.variability.meanDifference.description"
            components={{
              m: <InlineMath math="\Delta" />,
              bold: <strong />,
            }}
          />
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t(
              "randomVariable.characteristics.variability.meanDifference.exampleTitle",
            )}
          </h5>
          <p className="text-muted mb-4 small">
            {t(
              "randomVariable.characteristics.variability.meanDifference.exampleDesc",
            )}
          </p>
          <MeanDifferenceCalc />
        </div>

        {/* Variance */}
        <h4 className="mb-3">
          {t("randomVariable.characteristics.variability.variance.title")}
        </h4>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.variability.variance.description"
            components={{
              bold: <strong />,
              m1: <InlineMath math="s^2" />,
              m2: <InlineMath math="\sigma^2" />,
              m3: <InlineMath math="n-1" />,
              m4: <InlineMath math="N" />,
            }}
          />
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t(
              "randomVariable.characteristics.variability.variance.exampleTitle",
            )}
          </h5>
          <p className="text-muted mb-4 small">
            {t(
              "randomVariable.characteristics.variability.variance.exampleDesc",
            )}
          </p>
          <VarianceCalc />
        </div>

        {/* Standard Deviation */}
        <h4 className="mt-4">
          {t(
            "randomVariable.characteristics.variability.standardDeviation.title",
          )}
        </h4>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.variability.standardDeviation.description"
            components={{
              bold: <strong />,
              m1: <InlineMath math="s" />,
              m2: <InlineMath math="\sigma" />,
            }}
          />
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t(
              "randomVariable.characteristics.variability.standardDeviation.exampleTitle",
            )}
          </h5>
          <p className="text-muted mb-4 small">
            {t(
              "randomVariable.characteristics.variability.standardDeviation.exampleDesc",
            )}
          </p>
          <StandardDeviationCalc />
        </div>

        {/* Coefficient of Variation */}
        <h4 className="mt-4">
          {t(
            "randomVariable.characteristics.variability.coefficientOfVariation.title",
          )}
        </h4>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.variability.coefficientOfVariation.description"
            components={{
              m: <InlineMath math="v_x" />,
              bold: <strong />,
            }}
          />
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t(
              "randomVariable.characteristics.variability.coefficientOfVariation.exampleTitle",
            )}
          </h5>
          <p className="text-muted mb-4 small">
            {t(
              "randomVariable.characteristics.variability.coefficientOfVariation.exampleDesc",
            )}
          </p>
          <CoefficientOfVariationCalc />
        </div>

        {/* Quartile Deviation */}
        <h4 className="mt-4">
          {t(
            "randomVariable.characteristics.variability.quartileDeviation.title",
          )}
        </h4>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.variability.quartileDeviation.description"
            components={{
              m1: <InlineMath math="Q_x" />,
              m2: <InlineMath math="Q_3" />,
              m3: <InlineMath math="Q_1" />,
              bold: <strong />,
            }}
          />
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t(
              "randomVariable.characteristics.variability.quartileDeviation.exampleTitle",
            )}
          </h5>
          <p className="text-muted mb-4 small">
            <Trans
              i18nKey="randomVariable.characteristics.variability.quartileDeviation.exampleDesc"
              components={{
                m1: <InlineMath math="Q_x" />,
                m2: <InlineMath math="Q_x" />,
              }}
            />
          </p>
          <QuartileDeviationCalc />
        </div>
      </div>

      {/* OTHER MEASURES */}
      <div id="other-measures" className="mb-5">
        <h3 className="mb-3">
          {t("randomVariable.characteristics.otherMeasures.title")}
        </h3>
        <p className="mb-4">
          {t("randomVariable.characteristics.otherMeasures.description")}
        </p>

        {/* Skewness */}
        <h4 className="mt-4">
          {t("randomVariable.characteristics.otherMeasures.skewness.title")}
        </h4>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.otherMeasures.skewness.description"
            components={{
              m: <InlineMath math="\alpha" />,
              bold: <strong />,
            }}
          />
        </p>
        <div className="overflow-x-auto pb-2 mb-4">
          <BlockMath math="\alpha = \frac{1}{n s_x^3} \cdot \sum_{i=1}^{n} (x_i - \bar{x})^3" />
        </div>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t(
              "randomVariable.characteristics.otherMeasures.skewness.exampleTitle",
            )}
          </h5>
          <p className="text-muted mb-4 small">
            <Trans
              i18nKey="randomVariable.characteristics.otherMeasures.skewness.exampleDesc"
              components={{
                bold: <strong />,
              }}
            />
          </p>
          <SkewnessChart />
        </div>

        {/* Kurtosis */}
        <h4 className="mt-4">
          {t("randomVariable.characteristics.otherMeasures.kurtosis.title")}
        </h4>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.otherMeasures.kurtosis.description"
            components={{
              m: <InlineMath math="\varepsilon" />,
              bold: <strong />,
            }}
          />
        </p>
        <div className="overflow-x-auto pb-2 mb-4">
          <BlockMath math="\varepsilon = \frac{1}{n s_x^4} \cdot \sum_{i=1}^{n} (x_i - \bar{x})^4 - 3" />
        </div>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t(
              "randomVariable.characteristics.otherMeasures.kurtosis.exampleTitle",
            )}
          </h5>
          <p className="text-muted mb-4 small">
            <Trans
              i18nKey="randomVariable.characteristics.otherMeasures.kurtosis.exampleDesc"
              components={{ bold: <strong /> }}
            />
          </p>
          <KurtosisChart />
        </div>
      </div>

      {/* FIVE NUMBER SUMMARY */}
      <div id="five-number" className="mb-4">
        <h3 className="mb-3">
          {t("randomVariable.characteristics.fiveNumber.title")}
        </h3>

        <div className="mb-4">
          <Trans
            i18nKey="randomVariable.characteristics.fiveNumber.description"
            components={{
              bold: <strong />,
              m1: <InlineMath math="Q_1" />,
              m2: <InlineMath math="Q_3" />,
              ul: <ul />,
              li: <li />,
            }}
          />
        </div>
        <p className="mb-4 small fst-italic">
          {t("randomVariable.characteristics.fiveNumber.note")}
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            {t("randomVariable.characteristics.fiveNumber.exampleTitle")}
          </h5>

          <p className="text-muted mb-4 small">
            <Trans
              i18nKey="randomVariable.characteristics.fiveNumber.exampleDesc"
              components={{ bold: <strong /> }}
            />
          </p>
          <FiveNumberSummaryBoxplot />
        </div>
      </div>
    </section>
  );
}

export default Characteristics;
