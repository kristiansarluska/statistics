import { useTranslation } from "react-i18next";

function ProbabilityDistributions() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("topics.probabilityDistributions")}</h1>
      <p>{t("topics.probabilityDistributions.description")}</p>
    </div>
  );
}

export default ProbabilityDistributions;
