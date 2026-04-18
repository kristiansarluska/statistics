<p align="center">
  <img src="public/assets/images/logo_left.svg" alt="StatTerra Logo" width="300" />
</p>

# StatTerra

StatTerra is an interactive web application designed for teaching and learning statistical methods in geoinformatics. Developed as a part of a bachelor thesis, it provides an educational environment combining theoretical texts, mathematical formulas, interactive data visualizations, and real-world geographical data.

## Features

- **Interactive Charts:** Dynamic visualizations of probability distributions, parameter estimation, hypothesis testing, correlation, etc.
- **Spatial Data Visualization:** Interactive maps rendering geospatial data (e.g., NUTS regions, choropleth maps).
- **Mathematical Formulas:** Crisp rendering of complex statistical formulas using KaTeX.
- **Multilingual Support:** Interface and content localization (English, Czech, Slovak).
- **Dark/Light Mode:** Built-in theme toggling for better accessibility.

## Tech Stack

- **Framework:** React 18 with Vite
- **Routing:** React Router v7
- **Styling:** CSS & Bootstrap
- **Data Visualization:** Recharts, Leaflet (React-Leaflet)
- **Math Rendering:** KaTeX (React-KaTeX)
- **Localization:** i18next

## Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kristiansarluska/StatTerra.git
   cd StatTerra
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the local Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### Building for Production

To build the application for static hosting (such as GitHub Pages):

```bash
npm run build
```

This generates a `dist` folder containing the optimized and minified assets.

## Deployment

This project is configured for automated deployment via **GitHub Actions**. Any push to the `main` branch triggers the deployment workflow, which:

1. **Checks out** the repository.
2. **Installs dependencies** using `npm ci` for a clean, reproducible install.
3. **Builds the project** with `npm run build` to generate production-ready assets.
4. **Deploys to GitHub Pages** by automatically pushing the contents of the `dist` folder to the `gh-pages` branch.

The live application is hosted and served directly from the `gh-pages` branch.

---

**Have fun exploring!**
