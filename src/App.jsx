import { useState, useRef, useMemo, useEffect, Fragment } from "react";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MainRoutes from "./components/Main/Main";
import { useCookies } from "react-cookie";
import { registerTheme } from "echarts";
import chalk from "./themes/Chalk";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Transactions } from "./pages/transactions/Transactions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Wallets } from "./pages/wallets/Wallets";
import { Assets } from "./pages/assets/Assets";

const queryClient = new QueryClient();

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["themeMode"]);
  // const [themeMode, setThemeMode] = useState("dark");
  registerTheme("chalk-dark", chalk);

  if (Object.keys(cookies).length === 0) {
    setCookie("themeMode", "light", { path: "/" });
  }

  const theme = createTheme({
    palette: {
      mode: cookies.themeMode === "dark" ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <QueryClientProvider client={queryClient}>
        <Router>
          <MainRoutes
            allRoutes={
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="/wallets" element={<Wallets />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/dividends" element={<div>Olá mundo</div>} />
                <Route path="/assets" element={<Assets />} />
              </Routes>
            }
          />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
