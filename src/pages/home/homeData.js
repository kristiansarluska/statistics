// src/pages/home/homeData.js

export const chapters = [
  {
    title: "Náhodná veličina",
    desc: "Základné koncepty, typy rozdelení a charakteristiky polohy či variability.",
    icon: "🎲",
    path: "/random-variable",
  },
  {
    title: "Rozdelenia pravdepodobnosti",
    desc: "Diskrétne a spojité rozdelenia s vizualizáciou funkcií.",
    icon: "📊",
    path: "/probability-distributions",
  },
  {
    title: "Odhady parametrov",
    desc: "Bodové a intervalové odhady, simulácie na reálnych dátach.",
    icon: "🎯",
    path: "/parameter-estimation",
  },
  {
    title: "Testovanie hypotéz",
    desc: "Všeobecný postup testovania a interaktívne t-testy.",
    icon: "⚖️",
    path: "/hypothesis-testing",
  },
  {
    title: "Korelačná analýza",
    desc: "Skúmanie vzťahov medzi premennými a korelačné koeficienty.",
    icon: "📈",
    path: "/correlation",
  },
];

export const methodologyModules = [
  {
    id: "theory",
    title: "Základná teória",
    shortDesc:
      "Vysvetlenie štatistických pojmov a metód vrátane matematických zápisov (KaTeX).",
    fullDesc:
      "Prehľadné zhrnutie teórie. V aplikácii sú všetky vzorce renderované cez KaTeX, čo zabezpečuje ich presnosť a čitateľnosť.",
    placeholderText: "[ Ukážka: Vzorec vyrenderovaný cez KaTeX ]",
  },
  {
    id: "interactive",
    title: "Interaktívne prvky",
    shortDesc:
      "Dynamické grafy a kalkulačky, kde si môžeš meniť vstupné parametre.",
    fullDesc:
      "Vyskúšaj si, ako zmena parametrov ovplyvňuje tvar rozdelenia. Tu neskôr vložíme reálny React komponent (napr. NormalChart alebo kalkulačku).",
    placeholderText: "[ Ukážka: Skutočný Recharts komponent s posuvníkmi ]",
  },
  {
    id: "data",
    title: "Dáta z praxe",
    shortDesc:
      "Aplikácia metód priamo na reálnych európskych či slovenských geodátach.",
    fullDesc:
      "Štatistika pre geoinformatikov má najväčší zmysel na reálnych mapách. Ukážka interaktívnej mapy s NUTS regiónmi.",
    placeholderText: "[ Ukážka: Reálna Leaflet mapa NUTS regiónov ]",
  },
];
