// src/components/sidebar/sidebarData.js
export const sidebarData = [
  {
    labelKey: "topics.randomVariable",
    path: "/random-variable",
  },
  {
    labelKey: "topics.probabilityDistributions",
    path: "/probability-distributions",
    children: [
      { label: "Motivácia", path: "/probability-distributions#motivation" },
      {
        label: "Pravdepodobnostná a distribučná funkcia",
        path: "/probability-distributions#pdf-cdf",
      },
      /*{ label: "Diskrétna a spojitá veličina", path: "/probability-distributions#discrete-vs-continuous" },*/
      {
        label: "Diskrétne rozdelenia",
        path: "/probability-distributions#discrete-distributions",
        children: [
          {
            label: "Alternatívne rozdelenie",
            path: "/probability-distributions#bernoulli",
          },
          {
            label: "Rovnomerné rozdelenie",
            path: "/probability-distributions#uniform-discrete",
          },
          {
            label: "Binomické rozdelenie",
            path: "/probability-distributions#binomial",
          },
          {
            label: "Poissonovo rozdelenie",
            path: "/probability-distributions#poisson",
          },
        ],
      },
      {
        label: "Spojité rozdelenia",
        path: "/probability-distributions#continuous-distributions",
        children: [
          {
            label: "Rovnomerné rozdelenie",
            path: "/probability-distributions#uniform-continuous",
          },
          {
            label: "Exponenciálne rozdelenie",
            path: "/probability-distributions#exponential",
          },
          {
            label: "Normálne rozdelenie",
            path: "/probability-distributions#normal",
            children: [
              {
                label: "Chí kvadrát rozdelenie",
                path: "/probability-distributions#chi-square",
              },
              {
                label: "Studentovo t rozdelenie",
                path: "/probability-distributions#student-t",
              },
              {
                label: "Fisherovo F rozdelenie",
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
  },
  {
    labelKey: "topics.hypothesisTesting",
    path: "/hypothesis-testing",
  },
  {
    labelKey: "topics.correlation",
    path: "/correlation",
  },
  {
    labelKey: "topics.spatialAutocorrelation",
    path: "/spatial-autocorrelation",
  },
  {
    labelKey: "topics.regression",
    path: "/regression",
  },
];
