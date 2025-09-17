import { useTranslation } from "react-i18next";

function Regression() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("topics.regression")}</h1>
      <p>{t("topics.regression.description")}</p>
    </div>
  );
}

export default Regression;
