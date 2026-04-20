// src/pages/home/homeData.js

/**
 * @file homeData.js
 * @description Static data configuration for the landing page.
 * Contains definitions for interactive chapter cards and methodology modules,
 * linking translation keys to their respective assets and application routes.
 */

/**
 * @constant chapters
 * @description Array of main statistical topics displayed as navigational cards.
 * Each item includes localization keys for title and description, an icon path, and the target route.
 */
export const chapters = [
  {
    titleKey: "home.data.chapters.randomVariable.title",
    descKey: "home.data.chapters.randomVariable.desc",
    icon: "assets/images/dice.png",
    path: "/random-variable",
  },
  {
    titleKey: "home.data.chapters.probabilityDistributions.title",
    descKey: "home.data.chapters.probabilityDistributions.desc",
    icon: "assets/images/normal-distribution.png",
    path: "/probability-distributions",
  },
  {
    titleKey: "home.data.chapters.parameterEstimation.title",
    descKey: "home.data.chapters.parameterEstimation.desc",
    icon: "assets/images/estimation.png",
    path: "/parameter-estimation",
  },
  {
    titleKey: "home.data.chapters.hypothesisTesting.title",
    descKey: "home.data.chapters.hypothesisTesting.desc",
    icon: "assets/images/hypothesis.png",
    path: "/hypothesis-testing",
  },
  {
    titleKey: "home.data.chapters.correlation.title",
    descKey: "home.data.chapters.correlation.desc",
    icon: "assets/images/correlation.png",
    path: "/correlation",
  },
  {
    titleKey: "home.data.chapters.anova.title",
    descKey: "home.data.chapters.anova.desc",
    icon: "assets/images/anova.png",
    path: "/anova",
  },
];

export const methodologyModules = [
  {
    id: "theory",
    titleKey: "home.data.methodologyModules.theory.title",
    shortDescKey: "home.data.methodologyModules.theory.shortDesc",
    longDescKey: "home.data.methodologyModules.theory.longDesc",
  },
  {
    id: "interactive",
    titleKey: "home.data.methodologyModules.interactive.title",
    shortDescKey: "home.data.methodologyModules.interactive.shortDesc",
    longDescKey: "home.data.methodologyModules.interactive.longDesc",
  },
  {
    id: "data",
    titleKey: "home.data.methodologyModules.data.title",
    shortDescKey: "home.data.methodologyModules.data.shortDesc",
    longDescKey: "home.data.methodologyModules.data.longDesc",
  },
];
