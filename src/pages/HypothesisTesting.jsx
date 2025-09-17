import { useTranslation } from "react-i18next";

function HypothesisTesting() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("topics.hypothesisTesting")}</h1>
      <p>{t("topics.hypothesisTesting.description")}</p>
    </div>
  );
}

export default HypothesisTesting;
