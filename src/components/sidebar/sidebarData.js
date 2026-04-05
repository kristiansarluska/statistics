// src/components/sidebar/sidebarData.js
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
          },
          {
            labelKey: "sidebar.randomVariable.variability",
            path: "/random-variable#variability",
          },
          {
            labelKey: "sidebar.randomVariable.otherMeasures",
            path: "/random-variable#other-measures",
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
  /*
  {
    labelKey: "topics.spatialAutocorrelation",
    path: "/spatial-autocorrelation",
  },
  { labelKey: "topics.regression", path: "/regression" },*/
];
