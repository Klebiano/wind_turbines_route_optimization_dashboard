import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
  Collapse,
  Typography,
} from "@mui/material";
import { styled, makeStyles } from "@mui/material/styles";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import AirIcon from "@mui/icons-material/Air";
import TimelineIcon from "@mui/icons-material/Timeline";
import { DrawerHeader, drawerWidth } from "../DrawerHeader/DrawerHeader";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const SideBar = ({ open, handleDrawerClose }) => {
  const theme = useTheme();
  let navigate = useNavigate();

  // const [openDashboardCollapse, setOpenDashboardCollapse] = useState(true);
  const [openProductionCollapse, setOpenProductionCollapse] = useState(true);
  const [openAdminCollapse, setOpenAdminCollapse] = useState(true);

  // const handleDashboardClick = () => {
  //   setOpenDashboardCollapse(!openDashboardCollapse);
  // };

  const handleProductionClick = () => {
    setOpenProductionCollapse(!openProductionCollapse);
  };

  const handleAdminClick = () => {
    setOpenAdminCollapse(!openAdminCollapse);
  };

  const sidebarList = [
    {
      listitem: "Optimize Routes",
      icon: <TimelineIcon sx={{ fontSize: 20 }} />,
      clickfunction: function () {
        navigate("/");
      },
      openstate: true,
      pages: [],
    },
    // {
    //   listitem: "Production",
    //   icon: <TimelineIcon sx={{ fontSize: 20 }} />,
    //   clickfunction: handleProductionClick,
    //   openstate: openProductionCollapse,
    //   pages: [
    //     { page: "Wallets", path: "/wallets" },
    //     { page: "Transactions", path: "/transactions" },
    //     { page: "Dividends", path: "/dividends" },
    //   ],
    // },
    // {
    //   listitem: "Admin",
    //   icon: <AirIcon sx={{ fontSize: 20 }} />,
    //   clickfunction: handleAdminClick,
    //   openstate: openAdminCollapse,
    //   pages: [{ page: "Assets", path: "/assets" }],
    // },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <Tooltip title="Close menu" arrow>
              <ChevronLeftIcon />
            </Tooltip>
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ p: 0 }}>
        {sidebarList.map((dict, index) => {
          const FragmentSidebar = (
            <Fragment key={dict.listitem + "-frag"}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={dict.clickfunction}
                  style={{
                    paddingBottom: 2,
                    paddingTop: 5,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                    {dict.icon}
                  </ListItemIcon>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography variant="body2" style={{ lineHeight: 0 }}>
                        {dict.listitem}
                      </Typography>
                    }
                  />
                  {dict.openstate ? (
                    dict.pages.length > 0 ? (
                      <ExpandLess />
                    ) : (
                      ""
                    )
                  ) : dict.pages.length > 0 ? (
                    <ExpandMore />
                  ) : (
                    ""
                  )}
                </ListItemButton>
              </ListItem>
              <Divider
                sx={{ display: dict.pages.length > 0 ? "block" : "none" }}
              />
              <Collapse in={dict.openstate} timeout="auto" unmountOnExit>
                {dict.pages.map((pagedict, index) => (
                  <List
                    key={index.toString() + "-page-list"}
                    component="div"
                    disablePadding
                  >
                    <ListItemButton
                      component={Link}
                      // href={pagedict.path}
                      to={pagedict.path}
                      style={{ paddingBottom: 2, paddingTop: 5 }}
                    >
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography variant="body2" sx={{ ml: 4 }}>
                            {pagedict.page}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </List>
                ))}
                <Divider />
              </Collapse>
            </Fragment>
          );

          return FragmentSidebar;
        })}
      </List>
    </Drawer>
  );
};

export default SideBar;
