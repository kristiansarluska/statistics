import { useTranslation } from "react-i18next";

function SpatialAutocorrelation() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("topics.spatialAutocorrelation")}</h1>
      <p>{t("topics.spatialAutocorrelation.description")}</p>
    </div>
  );
}

export default SpatialAutocorrelation;
