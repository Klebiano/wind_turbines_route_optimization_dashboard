import { useState, useRef, Fragment } from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useCookies } from "react-cookie";
import { Tooltip } from "@mui/material";

const DarkModeButton = () => {
  const theme = useTheme();
  const [cookies, setCookie, removeCookie] = useCookies(["themeMode"]);

  const toggleThemeMode = (event) => {
    setCookie("themeMode", cookies.themeMode === "dark" ? "light" : "dark", {
      path: "/",
    });
  };

  return (
    // {theme.palette.mode} mode
    <Fragment>
      <Box sx={{ display: "inline" }}>
        <Tooltip
          title={`Toggle ${
            cookies.themeMode === "dark" ? "light" : "dark"
          } mode`}
          arrow
        >
          <IconButton onClick={() => toggleThemeMode()} color="inherit">
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Fragment>
  );
};

export default DarkModeButton;
