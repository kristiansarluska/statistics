import { useTranslation } from "react-i18next";

function Correlation() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("topics.correlation")}</h1>
      <p>{t("topics.correlation.description")}</p>
    </div>
  );
}

export default Correlation;
