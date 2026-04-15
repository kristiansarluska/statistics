// src/hooks/useDynamicMeta.js
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { sidebarData } from "../components/sidebar/sidebarData"; // Skontroluj správnosť cesty k importu

export function useDynamicMeta() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Nastavenie jazyka dokumentu
    document.documentElement.lang = i18n.language;

    // 2. Nájdenie názvu hlavnej kapitoly podľa aktuálnej URL (pathname)
    const getChapterName = (currentPath) => {
      const chapter = sidebarData.find((item) => item.path === currentPath);
      // Používame .labelKey namiesto .title
      return chapter ? t(chapter.labelKey) : null;
    };

    const chapterTitle = getChapterName(pathname);
    const baseTitle = t("meta.title");

    // Ak sme na podstránke, pridáme názov kapitoly, inak len základný názov (Home)
    document.title =
      chapterTitle && pathname !== "/"
        ? `${baseTitle} | ${chapterTitle}`
        : baseTitle;

    // 3. Aktualizácia ostatných metatagov
    const updateMeta = (name, content, isProperty = false) => {
      const selector = isProperty
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", content);
    };

    const desc = t("meta.description");
    const keywords = t("meta.keywords");

    updateMeta("description", desc);
    updateMeta("keywords", keywords);

    updateMeta("og:title", document.title, true);
    updateMeta("og:description", desc, true);

    updateMeta("twitter:title", document.title);
    updateMeta("twitter:description", desc);
  }, [i18n.language, pathname, t]);
}
