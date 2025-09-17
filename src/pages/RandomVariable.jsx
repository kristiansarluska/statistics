import { useTranslation } from "react-i18next";

function RandomVariable() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("topics.randomVariable")}</h1>
      <p>{t("topics.randomVariable.description")}</p>
    </div>
  );
}

export default RandomVariable;
