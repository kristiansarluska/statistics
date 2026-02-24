// src/pages/ProbabilityDistributions.jsx
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/charts.css";

// Pod-komponenty
import Motivation from "./probabilityDistributions/Motivation";
import PdfCdf from "./probabilityDistributions/PdfCdf";
import DiscreteDistributions from "./probabilityDistributions/DiscreteDistributions";
import ContinuousDistributions from "./probabilityDistributions/ContinuousDistributions";

function ProbabilityDistributions() {
  const { t } = useTranslation();
  const location = useLocation();

  // --- scroll na hash po navigácii ---
  useEffect(() => {
    if (!location.pathname.startsWith("/probability-distributions")) return;

    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <h1 id="page-title">{t("topics.probabilityDistributions")}</h1>
      <p>
        Prosím, funguj. Toto je testovací obsah prenesený do Reactu. Lorem ipsum
        dolor sit amet, consectetur adipiscing elit. Aliquam posuere lorem ut
        erat varius, porttitor congue ligula varius. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Aliquam posuere lorem ut erat varius,
        porttitor congue ligula varius. Pellentesque dui nulla, posuere ut ex
        lacinia, commodo maximus mauris. Suspendisse a risus faucibus, dictum
        libero quis, porttitor tellus. Praesent ut efficitur neque. Vestibulum
        scelerisque ac orci rutrum fermentum. Morbi bibendum lacinia lorem, at
        dignissim sem consectetur consectetur. Maecenas tincidunt fermentum
        magna, vel convallis sem ultricies rutrum. Nullam at lectus et magna
        porta lacinia in in justo. Integer convallis, leo ac sodales iaculis,
        risus arcu sodales nunc, non maximus nisl elit ut nisi. Pellentesque
        aliquet enim eget odio lobortis, ut eleifend turpis varius. Cras vel
        orci id dolor gravida congue. Duis placerat, erat at auctor dictum,
        ipsum neque aliquet libero, sit amet bibendum ipsum diam et turpis.
        Vivamus consectetur eu ex id interdum. Etiam dictum augue leo, ut
        iaculis est fermentum ut. Mauris sed blandit sem. Donec ullamcorper enim
        id egestas commodo. In posuere eu metus quis mattis. Morbi tincidunt non
        nisl a auctor. Cras eu enim arcu. In finibus tempus diam non semper.
        Aliquam erat volutpat. Integer tempor non arcu at fringilla. Nam sit
        amet lectus at diam laoreet porttitor. Morbi consequat nisl eu dui
        varius, a pretium libero pharetra. Phasellus et leo sit amet sem
        fringilla molestie nec at est. Proin vitae velit nibh. Duis in dictum
        odio. Morbi blandit finibus libero, sed sodales quam sollicitudin id.
        Praesent vehicula eros magna, molestie auctor quam pellentesque id. Sed
        vel malesuada lorem. Praesent sit amet mi eget dolor sodales imperdiet.
        Fusce et massa varius, pretium enim a, ullamcorper velit. Maecenas eget
        magna pellentesque, auctor felis vel, sagittis nisl. Curabitur maximus
        eleifend congue. Quisque venenatis facilisis convallis. Proin rhoncus
        blandit risus, eu elementum metus consectetur at. Morbi cursus sem
        tincidunt dui volutpat, non cursus felis commodo. Maecenas eleifend
        lacinia egestas. Etiam nulla nunc, fermentum quis purus non, vestibulum
        tincidunt tellus. Donec venenatis ut lectus ac consequat. Suspendisse
        vitae dignissim tortor, a suscipit dui. Donec rhoncus mollis diam, sed
        vulputate sapien. Curabitur commodo venenatis consequat. Ut laoreet odio
        et euismod sagittis. Phasellus tempor dignissim tempor. Sed consequat,
        magna quis feugiat blandit, orci urna posuere felis, sollicitudin
        ultricies sem orci sit amet dui.Pellentesque dui nulla, posuere ut ex
        lacinia, commodo maximus mauris. Suspendisse a risus faucibus, dictum
        libero quis, porttitor tellus. Praesent ut efficitur neque. Vestibulum
        scelerisque ac orci rutrum fermentum. Morbi bibendum lacinia lorem, at
        dignissim sem consectetur consectetur. Maecenas tincidunt fermentum
        magna, vel convallis sem ultricies rutrum. Nullam at lectus et magna
        porta lacinia in in justo. Integer convallis, leo ac sodales iaculis,
        risus arcu sodales nunc, non maximus nisl elit ut nisi. Pellentesque
        aliquet enim eget odio lobortis, ut eleifend turpis varius. Cras vel
        orci id dolor gravida congue. Duis placerat, erat at auctor dictum,
        ipsum neque aliquet libero, sit amet bibendum ipsum diam et turpis.
        Vivamus consectetur eu ex id interdum. Etiam dictum augue leo, ut
        iaculis est fermentum ut. Mauris sed blandit sem. Donec ullamcorper enim
        id egestas commodo. In posuere eu metus quis mattis. Morbi tincidunt non
        nisl a auctor. Cras eu enim arcu. In finibus tempus diam non semper.
        Aliquam erat volutpat. Integer tempor non arcu at fringilla. Nam sit
        amet lectus at diam laoreet porttitor. Morbi consequat nisl eu dui
        varius, a pretium libero pharetra. Phasellus et leo sit amet sem
        fringilla molestie nec at est. Proin vitae velit nibh. Duis in dictum
        odio. Morbi blandit finibus libero, sed sodales quam sollicitudin id.
        Praesent vehicula eros magna, molestie auctor quam pellentesque id. Sed
        vel malesuada lorem. Praesent sit amet mi eget dolor sodales imperdiet.
        Fusce et massa varius, pretium enim a, ullamcorper velit. Maecenas eget
        magna pellentesque, auctor felis vel, sagittis nisl. Curabitur maximus
        eleifend congue. Quisque venenatis facilisis convallis. Proin rhoncus
        blandit risus, eu elementum metus consectetur at. Morbi cursus sem
        tincidunt dui volutpat, non cursus felis commodo. Maecenas eleifend
        lacinia egestas. Etiam nulla nunc, fermentum quis purus non, vestibulum
        tincidunt tellus. Donec venenatis ut lectus ac consequat. Suspendisse
        vitae dignissim tortor, a suscipit dui. Donec rhoncus mollis diam, sed
        vulputate sapien. Curabitur commodo venenatis consequat. Ut laoreet odio
        et euismod sagittis. Phasellus tempor dignissim tempor. Sed consequat,
        magna quis feugiat blandit, orci urna posuere felis, sollicitudin
        ultricies sem orci sit amet dui.
      </p>
      <Motivation />
      <PdfCdf />
      <DiscreteDistributions />
      <ContinuousDistributions />
    </>
  );
}

export default ProbabilityDistributions;
