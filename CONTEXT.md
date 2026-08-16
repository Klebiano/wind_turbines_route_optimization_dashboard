# Project Context & Developer Reference

This document serves as the long-term memory and developer reference guide for the **Ant Colony / Route Optimization Frontend** repository.

---

## 1. Project Overview

**Ant Colony Route Optimization Frontend** (package name: `frontend`) is a React single-page application built with Vite. Its primary objective is to provide an interactive dashboard for optimizing maintenance routes across offshore/onshore wind turbine farms using optimization algorithms (Ant Colony Optimization, Genetic Algorithms, and Memetic Algorithms).

### Primary Features
* **Interactive Map & Route Visualization**: Renders wind turbine coordinates, dock stations, and calculated maintenance paths on a Leaflet map powered by ArcGIS satellite imagery.
* **Route Configuration**: Allows users to dynamically add, filter, or randomize wind turbines with specific subsystem failures and fault severity levels (Minor/Major), then execute optimization algorithms via a backend API.
* **Financial & Asset Management (Modular/Legacy Features)**: Includes supporting interfaces for tracking assets, investment wallets, transactions, and live USD-BRL currency rates.

### Target Audience
* Operations managers, maintenance engineers, and dispatchers planning service trips across wind farms.
* Developers expanding optimization interface capabilities or backend integrations.

---

## 2. Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Language** | JavaScript (ES6+ / JSX) | Core UI logic and components |
| **Build Tool & Dev Server** | Vite `^4.1.0` | Fast HMR development server and production bundler |
| **UI Framework** | React `^18.2.0` | Component-based user interface |
| **UI Library** | MUI (Material-UI v5) `^5.11.10` | Pre-built components, theme provider, and icon sets (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`) |
| **Data Tables** | `mui-datatables` `^4.3.0` | Searchable, pageable tables for turbine lists and assets |
| **Mapping & Geospatial** | React-Leaflet `^4.2.1` & Leaflet | Rendering geospatial map tiles, custom markers, and polyline route paths |
| **Data Fetching & Caching** | TanStack React Query `^4.24.9` | Asynchronous state management, query caching, and auto-refetching |
| **HTTP Client** | Axios `^1.3.3` | Communication with backend REST APIs |
| **Routing** | React Router DOM `^6.8.1` | Client-side page navigation |
| **Data Visualization & Theming** | `echarts-for-react` `^3.0.2` | Data charts and custom theme configuration (`Chalk.js`) |
| **State & Cookies** | `react-cookie` `^4.1.1` | Persistent client-side preference tracking (e.g., light/dark theme preference) |

---

## 3. Architecture & Directory Structure

```
ant_colony_vite_js/
├── docs/                     # Documentation assets, screenshots, and demo walkthrough videos
│   ├── images/               # UI preview screenshots
│   └── videos/               # Demo videos
├── index.html                # App entry HTML template
├── package.json              # Project dependencies and npm scripts
├── vite.config.js            # Vite configuration
├── public/                   # Static assets (icons, markers, images)
│   ├── dock-white.png        # Map marker icon for dock station
│   └── wind-power-yellow.png # Map marker icon for wind turbines
└── src/                      # Application source code
    ├── main.jsx              # React DOM entry point
    ├── App.jsx               # Root component: ThemeProvider, QueryClientProvider, and Routes setup
    ├── App.css               # Global application styling overrides
    ├── index.css             # Base CSS styles
    ├── api/                  # API service modules (Axios calls to backend)
    │   ├── assets/           # AssetsApi.jsx (Asset management & USD-BRL currency quote API calls)
    │   ├── dashboard/        # DashboardApi.jsx (Turbine map, subsystem, & route optimization API calls)
    │   ├── transactions/     # TransactionsAPI.jsx (Transaction endpoints)
    │   └── wallets/          # WalletsApi.jsx (User wallet endpoints)
    ├── components/           # Reusable UI layout and functional components
    │   ├── AccountMenu/      # Account menu dropdown component
    │   ├── DarkModeButton/   # Light/Dark mode toggle button
    │   ├── DrawerHeader/     # Helper styling for MUI drawer offset
    │   ├── Main/             # App shell wrapper managing drawer open state and top bar
    │   ├── Modal/            # Modular dialog popups (ModalComponent, ModalContent, ModalActions)
    │   ├── SideBar/          # Navigation drawer menu
    │   └── TopBar/           # Top app navigation bar header
    ├── pages/                # Page-level components matching application routes
    │   ├── assets/           # Assets management page and styles
    │   ├── dashboard/        # Route Optimizer dashboard (Leaflet Map, execution controls, table)
    │   ├── dividends/        # Dividends view
    │   ├── transactions/     # Transactions history table
    │   └── wallets/          # Wallets management page
    └── themes/               # ECharts and MUI theme definitions
        └── Chalk.js          # Custom dark chalk theme object for ECharts
```

---

## 4. Core Workflows

### 1. Application Initialization & Theme Flow
1. [`main.jsx`](file:///home/klebs/Documentos/ant_colony_vite_js/src/main.jsx) mounts the [`App`](file:///home/klebs/Documentos/ant_colony_vite_js/src/App.jsx) component into `#root`.
2. [`App.jsx`](file:///home/klebs/Documentos/ant_colony_vite_js/src/App.jsx) initializes:
   - **`QueryClientProvider`**: Manages React Query client state.
   - **`ThemeProvider`**: Evaluates the `themeMode` cookie (`light` or `dark`) via `react-cookie` and sets MUI palette defaults.
   - **`Router` & `MainRoutes`**: Wraps the layout and route hierarchy (`/`, `/wallets`, `/transactions`, `/dividends`, `/assets`).

### 2. Route Optimization Workflow
1. **Fetching Base Geospatial Data**:
   - `Dashboard` queries `getTurbineMapData()` and `getSubsystemData()` from [`DashboardApi.jsx`](file:///home/klebs/Documentos/ant_colony_vite_js/src/api/dashboard/DashboardApi.jsx).
   - Coordinates for turbines and docks are rendered on the `React-Leaflet` map.
2. **Configuring Service Targets**:
   - User adds specific turbines to the `tableData` state, or uses the **Randomize** feature to generate a set of target turbines with weighted fault types (`Minor` vs `Major`) and assigned subsystems.
3. **Execution**:
   - User selects an algorithm (`Genetic`, `Memetic`, or `Ant Colony`) and clicks **Run**.
   - `runRouteOptimizer()` sends a POST request with `tableData` and the algorithm parameters to the backend (`http://127.0.0.1:8000/ant-colony/run-route-optimizer/`).
4. **Result Rendering**:
   - The backend returns `turbine_order` (ordered coordinates) and `turbine_order_to_show` (step-by-step turbine names).
   - `mapPolylineList` updates in React state, drawing a green polyline (`<Polyline />`) connecting the route steps visually on the ArcGIS map canvas.

---

## 5. Development Guide

### Prerequisites
* **Node.js**: v16+ or v18+ recommended
* **npm**: v8+ package manager
* **Backend API**: Route optimization API server running on `http://127.0.0.1:8000`. Compatible backends include:
  * [ant_colony_fast_api_backend](https://github.com/Klebiano/ant_colony_fast_api_backend) (Python / FastAPI)
  * [ant_colony_golang_rust_backend](https://github.com/Klebiano/ant_colony_golang_rust_backend) (Go / Rust)


### Setup & Commands

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure Backend API Port in .env
# VITE_API_PORT=8000
# VITE_API_HOST=127.0.0.1

# 3. Start local Vite development server
npm run dev

# 4. Build production bundle (outputs to /dist)
npm run build

# 5. Preview local production build
npm run preview
```

---

## 6. Workspace Rules & Coding Standards

1. **Module Architecture & File Extensions**:
   - React components using JSX syntax must use the `.jsx` file extension.
   - Utility scripts or theme configurations use `.js`.
2. **API Separation**:
   - All Axios endpoints and HTTP communication are encapsulated within domain-specific service files under `src/api/<feature>/`, utilizing the centralized Axios instance from `src/api/config.js`. Components interact with API calls using React Query hooks (`useQuery` / `useMutation`).
3. **MUI System Styling**:
   - Layouts heavily utilize MUI v5 layout primitives (`Grid`, `Box`, `Stack`, `Card`, `FormControl`).
   - Page-specific custom styles live in standard `Styles.css` files adjacent to their page components.
4. **State Management Guidelines**:
   - Component transient state uses standard React hooks (`useState`, `useRef`).
   - Server state caching and invalidation rely on `@tanstack/react-query` query keys (e.g., `["mapData"]`, `["assetsData"]`).
5. **Backend Dependency**:
   - Endpoints in `src/api/` target `http://127.0.0.1:8000` by default, configurable via `VITE_API_PORT`, `VITE_API_HOST`, or `VITE_API_URL` environment variables in `.env`. Keep API URL signatures consistent when adding new features or connecting environment configurations.

---

## 7. Connected Repositories & Academic Research

### Backend Ecosystem
* **Python / FastAPI Engine**: [`ant_colony_fast_api_backend`](https://github.com/Klebiano/ant_colony_fast_api_backend)
  * Implements REST API endpoints with FastAPI, pandas data pipelines, PostgreSQL storage, and metaheuristic solvers (Ant Colony Optimization, Genetic Algorithms, Memetic Algorithms).
* **Go / Rust Engine**: [`ant_colony_golang_rust_backend`](https://github.com/Klebiano/ant_colony_golang_rust_backend)
  * High-performance parallelized backend for computationally intensive metaheuristic combinatorial optimization.

### Academic Publications & Research
The theoretical foundations, mathematical formulations, and experimental evaluations are detailed in the following research monographs:

#### 1. UFERSA Electrical Engineering Capstone (2023)
* **Title**: *Desenvolvimento de plataforma WEB para planejamento de rotas na manutenção de parques eólicos offshore utilizando algoritmo da otimização da colônia de formigas: Estudo de Caso*
* **Authors**: Klebiano Kennedy da Silva Lima, Matheus da Silva Menezes
* **Institution**: Universidade Federal Rural do Semi-Árido (UFERSA), Campus Mossoró
* **ABNT**: `LIMA, Klebiano Kennedy da Silva; MENEZES, Matheus da Silva. Desenvolvimento de plataforma WEB para planejamento de rotas na manutenção de parques eólicos offshore utilizando algoritmo da otimização da colônia de formigas: Estudo de Caso. 2023. 13 f. Trabalho de Conclusão de Curso (Graduação em Engenharia Elétrica) – Universidade Federal Rural do Semi-Árido (UFERSA), Mossoró, 2023.`

#### 2. MBA Data Science & Analytics Capstone (2024)
* **Title**: *Desenvolvimento de uma Plataforma Web para Otimização de Rotas de Manutenção em Parques Eólicos Offshore Utilizando Métodos Meta-heurísticos*
* **Authors**: Klebiano Kennedy da Silva Lima, Abdoulaye Aboubacari Mohamed
* **Program**: Especialização em MBA em Data Science e Analytics
* **ABNT**: `LIMA, Klebiano Kennedy da Silva; MOHAMED, Abdoulaye Aboubacari. Desenvolvimento de uma Plataforma Web para Otimização de Rotas de Manutenção em Parques Eólicos Offshore Utilizando Métodos Meta-heurísticos. 2024. 16 f. Trabalho de Conclusão de Curso (Especialização em MBA em Data Science e Analytics) – 2024.`


