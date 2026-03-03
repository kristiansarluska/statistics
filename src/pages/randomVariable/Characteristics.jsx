// src/pages/randomVariable/Characteristics.jsx
import React from "react";
import ArithmeticMeanCalc from "../../components/content/characteristics/ArithmeticMeanCalc";
import HarmonicMeanCalc from "../../components/content/characteristics/HarmonicMeanCalc";
import GeometricMeanCalc from "../../components/content/characteristics/GeometricMeanCalc";
import WeightedMeanCalc from "../../components/content/characteristics/WeightedMeanCalc";
import ModeCalc from "../../components/content/characteristics/ModeCalc";
import MedianCalc from "../../components/content/characteristics/MedianCalc";
import RangeCalc from "../../components/content/characteristics/RangeCalc";
import MeanDeviationCalc from "../../components/content/characteristics/MeanDeviationCalc";
import MeanDifferenceCalc from "../../components/content/characteristics/MeanDifferenceCalc";
import VarianceCalc from "../../components/content/characteristics/VarianceCalc";
import StandardDeviationCalc from "../../components/content/characteristics/StandardDeviationCalc";
import CoefficientOfVariationCalc from "../../components/content/characteristics/CoefficientOfVariationCalc";
import InterquartileRangeCalc from "../../components/content/characteristics/InterquartileRangeCalc";
import SkewnessChart from "../../components/charts/random-variable/characteristics/SkewnessChart";
import KurtosisChart from "../../components/charts/random-variable/characteristics/KurtosisChart";

const Characteristics = () => {
  return (
    <section id="characteristics">
      <h2 className="mb-4">Charakteristiky náhodnej veličiny</h2>

      <div id="location" className="mb-5">
        <h3 className="mb-3">Charakteristiky polohy</h3>

        <h4 className="mt-4">Aritmetický priemer</h4>
        <p>
          Aritmetický priemer je najpoužívanejšou mierou polohy. Predstavuje
          ťažisko hodnôt náhodnej veličiny. V geoinformatike sa využíva
          napríklad na určenie najpravdepodobnejšej hodnoty pri opakovaných
          meraniach toho istého bodu.
        </p>
        <div className="my-4">
          <ArithmeticMeanCalc />
        </div>

        <h4 className="mt-4">Harmonický priemer</h4>
        <p>
          Harmonický priemer sa v geoinformatike využíva najmä pri výpočte
          priemerných rýchlostí (napríklad rýchlosť vozidla alebo bezpilotného
          lietadla), ak sa vzťahujú na rovnako dlhé úseky dráhy.
        </p>
        <div className="my-4">
          <HarmonicMeanCalc />
        </div>

        <h4 className="mt-4">Geometrický priemer</h4>
        <p>
          Geometrický priemer je vhodný na výpočet priemerného tempa rastu.
          Používa sa napríklad pri analýze časových radov v GIS, ako je
          priemerné ročné tempo expanzie mestskej zástavby alebo zmeny rozlohy
          lesov.
        </p>
        <div className="my-4">
          <GeometricMeanCalc />
        </div>

        <h4 className="mt-4">Vážený priemer</h4>
        <p>
          Vážený priemer sa používa v situáciách, kedy jednotlivé merania nemajú
          rovnakú dôležitosť (váhu). V geoinformatike ho môžeme aplikovať
          napríklad pri zlučovaní súradníc z viacerých prístrojov, kde váhou je
          presnosť daného merania (napríklad prevrátená hodnota rozptylu
          prístroja).
        </p>
        <div className="my-4">
          <WeightedMeanCalc />
        </div>

        <h3 className="mb-3">Modus</h3>
        <p className="mb-4">
          Modus je hodnota, ktorá sa v štatistickom súbore vyskytuje
          najčastejšie. Pri spojitých dátach (napríklad presné GNSS merania) sa
          určuje ťažšie a hľadáme skôr interval s najväčšou hustotou. Pre
          diskrétne dáta je to však priama, konkrétna hodnota.
        </p>

        <div className="mx-auto w-100" style={{ maxWidth: "800px" }}>
          <h5 className="mb-3">
            Empirický modus: Počet poschodí v mestskej zástavbe
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            V nasledovnom príklade analyzujeme podlažnosť budov vo vybranej
            mestskej štvrti. Modusom bude typ budovy, ktorý sa v danej oblasti
            vyskytuje najviac (napr. dvojposchodové rodinné domy). Na grafe si
            môžete všimnúť aj sekundárny lokálny vrchol (tzv. lokálny modus)
            reprezentujúci napríklad zhluk sedemposchodových panelákov.
            Pridávaním alebo odoberaním budov môžete sledovať, ako sa mení
            najčastejšie sa vyskytujúca hodnota.
          </p>

          <div className="mb-5">
            <ModeCalc />
          </div>
        </div>

        <h3 className="mb-3">Medián</h3>
        <p className="mb-4">
          Medián rozdeľuje štatistický súbor na dve rovnako veľké polovice.
          Polovina hodnôt je menšia alebo rovná mediánu a druhá polovina je
          väčšia alebo rovná mediánu.
        </p>

        <div className="mx-auto w-100" style={{ maxWidth: "800px" }}>
          <h5 className="mb-3">
            Empirický medián: Výška budov a rezistencia voči extrémom
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            Hlavnou výhodou mediánu oproti aritmetickému priemeru je jeho{" "}
            <strong>odolnosť (rezistentnosť) voči odľahlým hodnotám</strong>.
            Predstavme si, že analyzujeme výšky budov v bežnej zástavbe.
            Vyskúšajte si do dát pridať extrémnu hodnotu – napríklad nový{" "}
            <strong>150-metrový mrakodrap</strong>. Všimnite si, že kým
            aritmetický priemer by táto stavba radikálne skreslila (vystrelil by
            na takmer dvojnásobok), medián sa posunie len minimálne, pretože
            zohľadňuje výhradne fyzický stred zoradeného radu.
          </p>

          <div className="mb-5">
            <MedianCalc />
          </div>
        </div>
      </div>

      <div id="variability" className="mb-5">
        <h3 className="mb-3">Charakteristiky variability (rozptýlenosti)</h3>
        <p className="mb-4">
          Kým miery polohy nám hovoria, kde sa dáta sústreďujú, miery
          variability nám prezrádzajú, ako veľmi sú od seba rozptýlené.
          Najjednoduchšou mierou je variačné rozpätie.
        </p>

        <h4 className="mb-3">Variačné rozpätie (Range)</h4>
        <p className="mb-4">
          Variačné rozpätie ($R$) je rozdiel medzi maximálnou a minimálnou
          hodnotou v štatistickom súbore. Je to rýchly ukazovateľ šírky
          intervalu, v ktorom sa dáta nachádzajú, no pre svoju podstatu je
          extrémne citlivý na odľahlé (extrémne) hodnoty.
        </p>

        <div className="mx-auto w-100" style={{ maxWidth: "800px" }}>
          <h5 className="mb-3">
            Empirické variačné rozpätie: Prevýšenie lyžiarskeho svahu
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            Predstavte si, že analyzujeme výškový profil lyžiarskeho svahu na
            Malej Morávke. Získali sme niekoľko výškových bodov (v metroch nad
            morom). Variačné rozpätie nám v tomto prípade udáva celkové
            prevýšenie zjazdovky. Pridajte do výpočtu extrémnu hodnotu
            (napríklad blízky vrchol Praděd s výškou 1492 m n. m.) a sledujte,
            ako sa variačné rozpätie okamžite skreslí.
          </p>

          <div className="mb-5">
            <RangeCalc />
          </div>
        </div>

        <h4 className="mb-3">Priemerná odchýlka (Mean Absolute Deviation)</h4>
        <p className="mb-4">
          Priemerná odchýlka vyjadruje, o koľko sa v priemere jednotlivé hodnoty
          štatistického súboru odchyľujú od ich aritmetického priemeru. Počíta
          sa ako aritmetický priemer absolútnych hodnôt odchýlok od strednej
          hodnoty. Oproti variačnému rozpätiu využíva informácie zo všetkých
          meraní, nielen z extrémov.
        </p>

        <div className="mx-auto w-100" style={{ maxWidth: "800px" }}>
          <h5 className="mb-3">
            Empirická priemerná odchýlka: Opakované meranie dĺžky
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            V geodézii nikdy nezmeriame rovnakú vzdialenosť dvakrát s absolútne
            identickým výsledkom. Nasledujúce dáta predstavujú päť nezávislých
            meraní dĺžky hranice parcely v metroch. Priemerná odchýlka nám v
            tomto prípade udáva priemernú absolútnu chybu jednotlivého merania
            voči strednej hodnote. Vyskúšajte pridať meranie so zjavnou hrubou
            chybou (napr. 51.5) a sledujte zmenu odchýlky.
          </p>

          <div className="mb-5">
            <MeanDeviationCalc />
          </div>
        </div>

        <h4 className="mb-3">Stredná diferencia (Mean Absolute Difference)</h4>
        <p className="mb-4">
          Stredná diferencia ($\Delta$) nevyjadruje odchýlku hodnôt od ich
          priemeru, ale priemerný absolútny rozdiel medzi{" "}
          <strong>akýmikolvek dvoma hodnotami</strong> navzájom. Počíta sa ako
          súčet absolútnych rozdielov všetkých možných dvojíc vydelený počtom
          týchto dvojíc.
        </p>

        <div className="mx-auto w-100" style={{ maxWidth: "800px" }}>
          <h5 className="mb-3">
            Empirická stredná diferencia: Heterogenita znečistenia ovzdušia
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            V geoinformatike často pracujeme so senzorovými sieťami. Predstavme
            si meracie stanice, ktoré sledujú koncentráciu prachových častíc
            PM10 (v µg/m³) vo veľkomeste. Stredná diferencia nám priamo povie,
            aký priemerný rozdiel v znečistení môžeme očakávať, ak sa presunieme
            z okolia jednej ľubovoľnej stanice k inej. Vyskúšajte do siete
            pridať stanicu ležiacu pri rušnej križovatke (napríklad s hodnotou
            85.0) a sledujte, ako vzrastie priemerný rozdiel v sieti.
          </p>

          <div className="mb-5">
            <MeanDifferenceCalc />
          </div>
        </div>

        <h4 className="mb-3">Rozptyl (Variance)</h4>
        <p className="mb-4">
          Rozptyl ($s^2$ pre výberový súbor, $\sigma^2$ pre základný súbor) je
          priemerná štvorcová odchýlka hodnôt od ich strednej hodnoty. Tým, že
          sa odchýlky umocňujú na druhú, rozptyl
          <strong> výrazne penalizuje veľké extrémy</strong>. Nevýhodou je, že
          výsledok vychádza v štvorcových jednotkách (napr. metre štvorcové,
          stupne Celzia na druhú), čo je ťažšie na priamu interpretáciu.
        </p>

        <div className="mx-auto w-100" style={{ maxWidth: "800px" }}>
          <h5 className="mb-3">
            Empirický rozptyl: Heterogenita mračna bodov (LiDAR)
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            Pri leteckom laserovom skenovaní lesa nás zaujíma nielen priemerná
            hustota bodov, ale aj jej variabilita. Nasledujúce dáta reprezentujú
            počet odrazov (bodov) na meter štvorcový vo vybraných testovacích
            plochách. Vyskúšajte pridať plochu s extrémne hustým pokrytím (napr.
            50 bodov/m²) a všimnite si, ako hodnota rozptylu kvôli umocňovaniu
            rapídne narastie.
          </p>

          <div className="mb-5">
            <VarianceCalc />
          </div>
        </div>

        <h4 className="mt-4">Smerodajná odchýlka</h4>
        <p className="mb-4">
          Smerodajná odchýlka ($s$ alebo $\sigma$) je odmocninou z rozptylu. Jej
          hlavnou výhodou je, že{" "}
          <strong>vracia výsledok do pôvodných jednotiek</strong> merania
          (napríklad stupne Celzia, metre), čo ju robí oveľa intuitívnejšou a
          ľahšie interpretovateľnou v praxi. Hovorí nám, o koľko sa hodnoty
          typicky odchyľujú od priemeru.
        </p>

        <div className="mx-auto w-100" style={{ maxWidth: "800px" }}>
          <h5 className="mb-3">
            Empirická smerodajná odchýlka: Mestský ostrov tepla (UHI)
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            Fenomén mestského ostrova tepla spôsobuje, že centrá miest sú
            výrazne teplejšie ako ich okolie. Predstavme si sieť piatich
            teplotných senzorov rozmiestnených v rôznych zónach mesta.
            Smerodajná odchýlka nám v tomto prípade hovorí, aké výrazné sú
            teplotné rozdiely v rámci tohto územia. Skúste pridať senzor z
            chladnejšieho prímestského parku (napr. 18.5 °C) a sledujte, ako sa
            odchýlka v systéme zväčší.
          </p>

          <div className="mb-5">
            <StandardDeviationCalc />
          </div>
        </div>

        <h4 className="mt-4">Variačný koeficient (Coefficient of Variation)</h4>
        <p className="mb-4">
          Variačný koeficient ($v_k$) je bezrozmerná (relatívna) miera
          variability, najčastejšie vyjadrená v percentách. Počíta sa ako pomer
          smerodajnej odchýlky k aritmetickému priemeru. Jeho obrovskou výhodou
          je, že
          <strong>
            {" "}
            umožňuje porovnávať variabilitu medzi súbormi s rôznymi
            jednotkami{" "}
          </strong>
          alebo diametrálne odlišnými priemermi (napr. variabilitu výšky stromov
          vs. hrúbky ich kmeňov).
        </p>

        <div className="mx-auto w-100" style={{ maxWidth: "800px" }}>
          <h5 className="mb-3">
            Empirický variačný koeficient: Priestorová nestálosť zrážok
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            V hydrológii a klimatológii sa variačný koeficient často využíva na
            zhodnotenie stabilitu zrážok. Nasledujúce dáta predstavujú ročné
            úhrny zrážok (v mm) na piatich rôznych zrážkomerných staniciach v
            sledovanej oblasti. Ak je výsledný koeficient vysoký (napr. nad 30
            %), hovorí nám to, že zrážky sú v území priestorovo veľmi
            nevyrovnané a nepredvídateľné. Vyskúšajte zmeniť hodnoty tak, aby
            boli zrážky vyrovnanejšie (napríklad všetkým staniciam nastavte
            hodnoty okolo 500 mm) a sledujte pokles percentuálnej variability.
          </p>

          <div className="mb-5">
            <CoefficientOfVariationCalc />
          </div>
        </div>

        <h4 className="mt-4">
          Medzikvartilová odchýlka / rozpätie (Interquartile Range - IQR)
        </h4>
        <p className="mb-4">
          Medzikvartilové rozpätie ($IQR$) sa zameriava výhradne na{" "}
          <strong>stredných 50 % dát</strong>. Vypočíta sa ako rozdiel medzi
          tretím ($Q_3$) a prvým kvartilom ($Q_1$). Keďže do výpočtu vôbec
          nevstupuje dolných ani horných 25 % hodnôt, táto charakteristika je
          extrémne odolná voči hrubým chybám a odľahlým hodnotám (tzv.
          outlierom).
        </p>

        <div className="mx-auto w-100" style={{ maxWidth: "800px" }}>
          <h5 className="mb-3">
            Empirické IQR: Trhové ceny pozemkov a vplyv extrémov
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            Katastrálne a cenové mapy často obsahujú anomálie. Predstavme si
            analýzu cien pozemkov (v €/m²) v jednej záhradkárskej osade. Medzi
            bežnými predajmi sa nachádza jeden extrém (napríklad špekulatívny
            nákup s hodnotou 145 €/m²). Kým obyčajné variačné rozpätie by pre
            tieto dáta vystrelilo nad 130 €, $IQR$ extrém odignoruje a vráti
            reálnu variabilitu stredu trhu (rozpätie len cca 3.5 €/m²). Skúste
            extrém (145) zmazať a všimnite si, že $IQR$ sa takmer nezmení.
          </p>

          <div className="mb-5">
            <InterquartileRangeCalc />
          </div>
        </div>
      </div>

      <div id="other-measures" className="mb-5">
        <h3 className="mb-3">Iné číselné miery</h3>

        <h4 className="mt-4">Koeficient šikmosti</h4>
        <p className="mb-4">
          Koeficient šikmosti hodnotí <strong>asymetriu</strong> rozdelenia dát
          okolo ich strednej hodnoty. Ak má rozdelenie dlhší chvost smerom k
          vyšším hodnotám, ide o <strong>kladnú šikmosť</strong>
          (extrémne veľké hodnoty ťahajú priemer nahor). Ak má dlhší chvost
          smerom k nižším hodnotám, ide o <strong>zápornú šikmosť</strong>.
        </p>

        <div className="mx-auto w-100" style={{ maxWidth: "800px" }}>
          <h5 className="mb-3">Interaktívna ukážka: Veková štruktúra lesa</h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            Presuňte bežec pre zmenu šikmosti rozdelenia veku stromov v lese.
            <strong>Kladná šikmosť</strong> predstavuje napríklad zmladený les
            po ťažbe (drvivá väčšina stromov je mladá, starých je minimum -
            chvost vpravo). <strong>Záporná šikmosť</strong> naopak modeluje
            starý neprestupný prales (väčšina stromov je stará, prežije len málo
            mladých kvôli nedostatku svetla - chvost vľavo).
          </p>

          <div className="mb-5">
            <SkewnessChart />
          </div>
        </div>

        <h4 className="mt-4">Koeficient špicatosti (Kurtosis)</h4>
        <p className="mb-4">
          Koeficient špicatosti opisuje koncentráciu hodnôt okolo strednej
          hodnoty v porovnaní s normálnym rozdelením. Zatiaľ čo laický pohľad sa
          často upriamuje len na "výšku špicu", v štatistike je dôležitejším
          prejavom špicatosti tzv.
          <strong> hrúbka chvostov</strong> (či sa v dátach vyskytujú extrémne
          odľahlé hodnoty).
        </p>

        <div className="mx-auto w-100" style={{ maxWidth: "800px" }}>
          <h5 className="mb-3">
            Interaktívna ukážka: Režim prietokov a bleskové povodne
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            V hydrológii je tvar rozdelenia kľúčový pre predikciu extrémov.
            <strong> Špicaté rozdelenie (Leptokurtické)</strong> s tučnými
            chvostmi modeluje napríklad neskrotenú horskú bystrinu alebo vádí v
            púšti. Drvivú väčšinu roka je prietok stabilne minimálny (vysoký
            špic v strede), no ak príde silná búrka, nastane nečakaná extrémna
            blesková povodeň (hrubé chvosty ďaleko od stredu). Naopak,
            <strong> ploché rozdelenie (Platykurtické)</strong> predstavuje
            veľkú rieku regulovanú priehradou. Prietok tu predvídateľne a
            rovnomerne kolíše v širšom strednom pásme, no k anomálnym extrémnym
            povodniam takmer nedochádza (tenké chvosty).
          </p>

          <div className="mb-5">
            <KurtosisChart />
          </div>
        </div>
      </div>

      <div id="five-number" className="mb-4">
        <h3 className="mb-3">Päťčíselná charakteristika</h3>
        <p>{/* Content... */}</p>
      </div>
    </section>
  );
};

export default Characteristics;
