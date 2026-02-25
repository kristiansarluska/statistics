import { useTranslation } from "react-i18next";
import PdfCdf from "./randomVariable/PdfCdf";

function RandomVariable() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("topics.randomVariable")}</h1>
      <p>{t("topics.randomVariable.description")}</p>
      <PdfCdf />
    </>
  );
}

export default RandomVariable;
