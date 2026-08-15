# 🐜 Wind Turbine Route Optimization Dashboard

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MUI](https://img.shields.io/badge/Material--UI-v5-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![React Query](https://img.shields.io/badge/React_Query-v4-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query/v4)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)

An interactive, high-performance web dashboard built with **React** and **Vite** designed to solve complex route planning and maintenance dispatch problems across offshore and onshore wind turbine farms using metaheuristic optimization algorithms (**Ant Colony Optimization**, **Genetic Algorithms**, and **Memetic Algorithms**).

---

## 📸 Screenshots & Previews

### Optimize Routes Dashboard (Live Application)
Full view of the route optimization pipeline: parameter selection, dynamic data table with turbine fault details, interactive satellite map with the computed shortest route polyline, and the ordered execution sequence:

![Optimize Routes Dashboard](./docs/images/Optimize%20Routes%20-%20localhost.png)

---

## ✨ Key Features

- 🗺️ **Interactive Geospatial Map & Satellite Imagery**:
  - High-resolution ArcGIS satellite imagery layer powered by **Leaflet** & **React-Leaflet**.
  - Dynamic map markers with custom visual indicators for dock stations (`Doca`) and offshore wind turbines.
  - Interactive tooltips, popups, and real-time neon green polyline paths displaying the optimized route traversal.

- ⚙️ **Metaheuristic Optimization Algorithms**:
  - Support for **Ant Colony Optimization (ACO)**, **Genetic Algorithm (GA)**, and **Memetic Algorithm (MA)**.
  - Configurable turbine targets with subsystem categorization (*Generator*, *Drive Train*, *Rotor Hub*, *Sensors*, *Electronic Control*, *Support & Housing*, *Mechanical Brake*, etc.) and fault severity levels (`Minor` vs `Major`).

- 🎲 **Batch Simulation & Randomizer**:
  - Dynamic turbine randomization tool with weighted fault distributions for rapid scenario generation and algorithmic benchmarking.

- 📋 **Data Grid & Route Sequence Flow**:
  - Searchable, sortable, and filterable data tables powered by `mui-datatables`.
  - Visual step-by-step breadcrumb sequence flow displaying the exact dispatch order from dock to turbines and back to dock.

- 🌓 **Theme Customization & Theming**:
  - Seamless Light / Dark mode toggle with persistent cookie state (`react-cookie`).
  - Modular styling built on Material UI (MUI v5) and custom themes.

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) | Component-based UI architecture |
| **Build Tool & Bundler** | [Vite 5](https://vitejs.dev/) | Instant HMR development and fast production bundling |
| **Component Library** | [Material UI (MUI v5)](https://mui.com/) | Responsive UI components, theme engine, and icons |
| **Maps & GIS** | [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/) | Geospatial canvas, coordinate projections, and polyline paths |
| **Data Management** | [TanStack React Query v4](https://tanstack.com/query/v4) | Server state caching, asynchronous query synchronization |
| **HTTP Client** | [Axios](https://axios-http.com/) | REST API communication with backend optimizer endpoints |
| **Data Tables** | [MUI-DataTables](https://github.com/gregnb/mui-datatables) | Advanced grid features (filtering, pagination, search) |
| **Routing** | [React Router DOM v6](https://reactrouter.com/) | Declarative client-side routing |
| **Data Visualization** | [ECharts for React](https://github.com/hustcc/echarts-for-react) | Analytical charts and telemetry visualizations |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or later
- **npm**: `v8.0.0` or later (or `yarn` / `pnpm`)
- **Backend Optimization API**: A running instance of the route optimization backend API (typically running on `http://127.0.0.1:8000`).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ant_colony_vite_js.git
   cd ant_colony_vite_js
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the port indicated in terminal output).

---

## 📦 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode with Hot Module Replacement (HMR). |
| `npm run build` | Bundles and optimizes the app for production into the `dist/` folder. |
| `npm run preview` | Locally previews the production build. |

---

## 🏗️ Project Structure

```text
ant_colony_vite_js/
├── docs/                     # Documentation assets and screenshots
│   └── images/               # UI preview screenshots for README
├── public/                   # Static assets (custom map markers, icons)
│   ├── dock-white.png        # Dock station marker icon
│   ├── wind-power-yellow.png # Wind turbine marker icon
│   └── logo.png              # Application logo
├── src/
│   ├── main.jsx              # Application entry point
│   ├── App.jsx               # Root provider setup (Theme, QueryClient, Routes)
│   ├── index.css             # Base stylesheet
│   ├── App.css               # Global theme and layout styles
│   ├── api/                  # Modular API clients (Axios & endpoints)
│   │   ├── dashboard/        # Turbine map data and optimization endpoints
│   │   ├── assets/           # Asset management & currency quote APIs
│   │   ├── transactions/     # Transaction records APIs
│   │   └── wallets/          # Wallet management APIs
│   ├── components/           # Reusable UI components
│   │   ├── TopBar/           # Application header navigation
│   │   ├── SideBar/          # Navigation drawer menu
│   │   ├── DarkModeButton/   # Light/Dark mode switcher
│   │   ├── Main/             # Shell layout container
│   │   └── Modal/            # Modular dialog modals
│   ├── pages/                # Page views
│   │   ├── dashboard/        # Route Optimizer Dashboard & Leaflet Map
│   │   ├── assets/           # Asset tracking page
│   │   ├── wallets/          # Wallet management page
│   │   └── transactions/     # Transaction history page
│   └── themes/               # ECharts and MUI theme definitions
│       └── Chalk.js          # Dark theme definition for ECharts
├── package.json              # Project dependencies and metadata
├── vite.config.js            # Vite configuration
└── README.md                 # Project documentation
```

---

## 🔄 Route Optimization Workflow

```mermaid
flowchart TD
    A[Start: Load Wind Farm Map] --> B[Fetch Turbine & Dock Coordinates]
    B --> C[Select Turbines or Click 'Randomize']
    C --> D[Assign Subsystems & Fault Types]
    D --> E[Choose Algorithm: Ant Colony / Genetic / Memetic]
    E --> F[Execute 'Run']
    F --> G[Backend Optimization Process]
    G --> H[Render Shortest Path Polyline on Map]
    H --> I[Display Step-by-Step Sequence Badges]
```

1. **Geospatial Mapping**: Coordinate sets for turbines and harbor docks are fetched via `getTurbineMapData()` and plotted onto the ArcGIS satellite map.
2. **Failure Configuration**: Target turbines requiring maintenance are added manually or automatically randomized with assigned subsystem faults and severity levels.
3. **Algorithm Execution**: A POST request containing the service targets is dispatched to the backend optimizer endpoint (`/ant-colony/run-route-optimizer/`).
4. **Visual Rendering**: The returned optimal traversal sequence (`turbine_order`) is rendered as an interactive path polyline on the Leaflet map and indexed in the sequence badges.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
