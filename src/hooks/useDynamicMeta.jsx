// src/hooks/useDynamicMeta.js
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { sidebarData } from "../components/sidebar/sidebarData";

/**
 * @function useDynamicMeta
 * @description A custom hook that dynamically updates the document's metadata (title, lang, meta tags)
 * based on the current route and active language. It synchronizes the page title with the
 * chapter names defined in `sidebarData`.
 */
export function useDynamicMeta() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Synchronize the document's language attribute with the current i18next language
    document.documentElement.lang = i18n.language;

    /**
     * Finds the current chapter name by matching the pathname against sidebarData entries.
     * @param {string} currentPath - The current URL path.
     * @returns {string|null} The localized title or null if not found.
     */
    const getChapterName = (currentPath) => {
      const chapter = sidebarData.find((item) => item.path === currentPath);
      // Use labelKey for localization as defined in the sidebar structure
      return chapter ? t(chapter.labelKey) : null;
    };

    const chapterTitle = getChapterName(pathname);
    const baseTitle = t("meta.title");

    // Construct the document title: "Base Title | Chapter Name" or just "Base Title" for Home
    document.title =
      chapterTitle && pathname !== "/"
        ? `${baseTitle} | ${chapterTitle}`
        : baseTitle;

    /**
     * Helper to update content of existing meta tags in the document head.
     * @param {string} name - The name or property attribute value.
     * @param {string} content - The new content value.
     * @param {boolean} [isProperty=false] - If true, uses 'property' selector (for OG tags), otherwise 'name'.
     */
    const updateMeta = (name, content, isProperty = false) => {
      const selector = isProperty
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", content);
    };

    // 3. Update SEO and Social Media meta tags
    const desc = t("meta.description");
    const keywords = t("meta.keywords");

    updateMeta("description", desc);
    updateMeta("keywords", keywords);

    // Open Graph (Facebook / LinkedIn)
    updateMeta("og:title", document.title, true);
    updateMeta("og:description", desc, true);

    // Twitter Cards
    updateMeta("twitter:title", document.title);
    updateMeta("twitter:description", desc);
  }, [i18n.language, pathname, t]);
}
