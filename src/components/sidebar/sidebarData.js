// src/components/sidebar/sidebarData.js
export const sidebarData = [
  {
    labelKey: "topics.randomVariable",
    path: "/random-variable",
    children: [
      {
        label: "Spojitá a diskrétna náhodná veličina",
        path: "/random-variable#continuous-discrete",
      },
      {
        label: "Rozdelenie náhodnej veličiny",
        path: "/random-variable#distribution",
        children: [
          {
            label: "Pravdepodobnostná funkcia",
            path: "/random-variable#pmf-pdf",
          },
          {
            label: "Distribučná funkcia",
            path: "/random-variable#cdf",
          },
          {
            label: "Kvantilová funkcia",
            path: "/random-variable#quantile",
          },
        ],
      },
      {
        label: "Charakteristiky náhodnej veličiny",
        path: "/random-variable#characteristics",
        children: [
          {
            label: "Charakteristiky polohy",
            path: "/random-variable#location",
          },
          {
            label: "Charakteristiky variability",
            path: "/random-variable#variability",
          },
          {
            label: "Iné číselné miery",
            path: "/random-variable#other-measures",
          },
          {
            label: "Päťčíselná charakteristika",
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
      { label: "Motivácia", path: "/probability-distributions#motivation" },
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
