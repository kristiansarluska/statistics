import { useTranslation } from "react-i18next";

function ParameterEstimation() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("topics.parameterEstimation")}</h1>
      <p>{t("topics.parameterEstimation.description")}</p>
    </div>
  );
}

export default ParameterEstimation;
