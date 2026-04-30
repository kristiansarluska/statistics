// src/components/sidebar/sidebarData.js

/**
 * @constant sidebarData
 * @description Defines the hierarchical navigation structure for the application's sidebar.
 * Each top-level item represents a main statistical topic and maps to an application route.
 * @type {Array<Object>}
 * * @property {string} labelKey - The i18n translation key for the navigation label.
 * @property {string} path - The URL path or hash fragment to navigate to.
 * @property {Array<Object>} [children] - Optional array of nested sub-navigation items.
 */
export const sidebarData = [
  {
    labelKey: "topics.randomVariable",
    path: "/random-variable",
    children: [
      {
        labelKey: "sidebar.randomVariable.continuousDiscrete",
        path: "/random-variable#continuous-discrete",
      },
      {
        labelKey: "sidebar.randomVariable.distribution",
        path: "/random-variable#distribution",
        children: [
          {
            labelKey: "sidebar.randomVariable.pmfPdf",
            path: "/random-variable#pmf-pdf",
          },
          {
            labelKey: "sidebar.randomVariable.cdf",
            path: "/random-variable#cdf",
          },
          {
            labelKey: "sidebar.randomVariable.quantile",
            path: "/random-variable#quantile",
          },
        ],
      },
      {
        labelKey: "sidebar.randomVariable.characteristics",
        path: "/random-variable#characteristics",
        children: [
          {
            labelKey: "sidebar.randomVariable.location",
            path: "/random-variable#location",
            children: [
              {
                labelKey: "sidebar.randomVariable.arithmeticMean",
                path: "/random-variable#arithmetic-mean",
              },
              {
                labelKey: "sidebar.randomVariable.harmonicMean",
                path: "/random-variable#harmonic-mean",
              },
              {
                labelKey: "sidebar.randomVariable.geometricMean",
                path: "/random-variable#geometric-mean",
              },
              {
                labelKey: "sidebar.randomVariable.weightedMean",
                path: "/random-variable#weighted-mean",
              },
              {
                labelKey: "sidebar.randomVariable.mode",
                path: "/random-variable#mode",
              },
              {
                labelKey: "sidebar.randomVariable.median",
                path: "/random-variable#median",
              },
            ],
          },
          {
            labelKey: "sidebar.randomVariable.variability",
            path: "/random-variable#variability",
            children: [
              {
                labelKey: "sidebar.randomVariable.range",
                path: "/random-variable#range",
              },
              {
                labelKey: "sidebar.randomVariable.meanDeviation",
                path: "/random-variable#mean-deviation",
              },
              {
                labelKey: "sidebar.randomVariable.meanDifference",
                path: "/random-variable#mean-difference",
              },
              {
                labelKey: "sidebar.randomVariable.variance",
                path: "/random-variable#variance",
              },
              {
                labelKey: "sidebar.randomVariable.standardDeviation",
                path: "/random-variable#standard-deviation",
              },
              {
                labelKey: "sidebar.randomVariable.coefficientOfVariation",
                path: "/random-variable#coefficient-of-variation",
              },
              {
                labelKey: "sidebar.randomVariable.quartileDeviation",
                path: "/random-variable#quartile-deviation",
              },
            ],
          },
          {
            labelKey: "sidebar.randomVariable.otherMeasures",
            path: "/random-variable#other-measures",
            children: [
              {
                labelKey: "sidebar.randomVariable.skewness",
                path: "/random-variable#skewness",
              },
              {
                labelKey: "sidebar.randomVariable.kurtosis",
                path: "/random-variable#kurtosis",
              },
            ],
          },
          {
            labelKey: "sidebar.randomVariable.fiveNumber",
            path: "/random-variable#five-number",
          },
        ],
      },
    ],
  },
  {
    labelKey: "topics.probabilityDistributions",
    path: "/probability-distributions",
    children: [
      {
        labelKey: "sidebar.probabilityDistributions.discrete",
        path: "/probability-distributions#discrete-distributions",
        children: [
          {
            labelKey: "sidebar.probabilityDistributions.bernoulli",
            path: "/probability-distributions#bernoulli",
          },
          {
            labelKey: "sidebar.probabilityDistributions.uniformDiscrete",
            path: "/probability-distributions#uniform-discrete",
          },
          {
            labelKey: "sidebar.probabilityDistributions.binomial",
            path: "/probability-distributions#binomial",
          },
          {
            labelKey: "sidebar.probabilityDistributions.poisson",
            path: "/probability-distributions#poisson",
          },
        ],
      },
      {
        labelKey: "sidebar.probabilityDistributions.continuous",
        path: "/probability-distributions#continuous-distributions",
        children: [
          {
            labelKey: "sidebar.probabilityDistributions.uniformContinuous",
            path: "/probability-distributions#uniform-continuous",
          },
          {
            labelKey: "sidebar.probabilityDistributions.exponential",
            path: "/probability-distributions#exponential",
          },
          {
            labelKey: "sidebar.probabilityDistributions.normal",
            path: "/probability-distributions#normal",
            children: [
              {
                labelKey: "sidebar.probabilityDistributions.chiSquare",
                path: "/probability-distributions#chi-square",
              },
              {
                labelKey: "sidebar.probabilityDistributions.studentT",
                path: "/probability-distributions#student-t",
              },
              {
                labelKey: "sidebar.probabilityDistributions.fisherF",
                path: "/probability-distributions#fisher-f",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    labelKey: "topics.parameterEstimation",
    path: "/parameter-estimation",
    children: [
      {
        labelKey: "sidebar.parameterEstimation.pointEstimation",
        path: "/parameter-estimation#point-estimation",
      },
      {
        labelKey: "sidebar.parameterEstimation.intervalEstimation",
        path: "/parameter-estimation#interval-estimation",
      },
    ],
  },
  {
    labelKey: "topics.hypothesisTesting",
    path: "/hypothesis-testing",
    children: [
      {
        labelKey: "sidebar.hypothesisTesting.procedure",
        path: "/hypothesis-testing#procedure",
      },
      {
        labelKey: "sidebar.hypothesisTesting.interactiveTest",
        path: "/hypothesis-testing#interactive-test",
      },
    ],
  },
  {
    labelKey: "topics.correlation",
    path: "/correlation",
    children: [
      {
        labelKey: "sidebar.correlation.analysis",
        path: "/correlation#analysis",
      },
      {
        labelKey: "sidebar.correlation.coefficients",
        path: "/correlation#coefficients",
      },
    ],
  },
  {
    labelKey: "topics.anova",
    path: "/anova",
    children: [
      {
        labelKey: "sidebar.anova.singleFactor",
        path: "/anova#single-factor",
      },
      {
        labelKey: "sidebar.anova.postHoc",
        path: "/anova#post-hoc",
      },
      {
        labelKey: "sidebar.anova.violation",
        path: "/anova#violation",
      },
    ],
  },
];
