import {
  Button,
  Link,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  Grid,
  useTheme,
  Avatar,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/system";
import { AppBar } from "../DrawerHeader/DrawerHeader";
import AccountMenu from "../AccountMenu/AccountMenu";
import DarkModeButton from "../DarkModeButton/DarkModeButton";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

const TopBar = (props) => {
  const theme = useTheme();

  return (
    <HideOnScroll {...props}>
      <AppBar position="fixed" open={props.open}>
        <Toolbar variant="dense">
          <Tooltip title="Open Menu" arrow>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={props.handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(props.open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Box width="100%" height="100%">
            <Grid container spacing={1}>
              <Grid item xs={6} md={6} align="start" alignSelf="center">
                <Tooltip title="Home">
                  <IconButton href="/">
                    <img
                      src={
                        theme.palette.mode === "dark"
                          ? "/wallet-logo.png"
                          : "/wallet-logo-white.png"
                      }
                      alt="voltalia logo"
                      width="33px"
                      height="33px"
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid
                item
                xs={6}
                md={6}
                alignSelf="center"
                align="right"
                justifyContent="center"
              >
                <DarkModeButton />
                <AccountMenu />
              </Grid>
            </Grid>
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default TopBar;
