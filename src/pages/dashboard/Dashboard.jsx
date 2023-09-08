import { useState, useEffect, useRef } from "react";
// import Avatar from "@mui/material/Avatar";
import {
  AddCircle,
  PlayCircle,
  Shuffle,
  Delete,
  ClearAll,
} from "@mui/icons-material";
// import Typography from "@mui/material/Typography";
// import ReactECharts from "echarts-for-react";
import {
  getTurbineMapData,
  getSubsystemData,
} from "../../api/dashboard/DashboardApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";
import MUIDataTable from "mui-datatables";
import "./Styles.css";
// import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import windTurbineIcon from "/wind-power-yellow.png";
import dockIcon from "/dock-white.png";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Tooltip,
} from "react-leaflet";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  useTheme,
  IconButton,
  Snackbar,
  Tooltip as MuiTooltip,
} from "@mui/material";

function Dashboard() {
  const theme = useTheme();
  const chartTheme = theme.palette.mode === "dark" ? "dark" : "westeros";
  const queryClient = useQueryClient();
  const refTurbineNameInput = useRef("");
  const refSubsystemNameInput = useRef("");
  const refFaultType = useRef("");
  const refTurbineNumber = useRef("");
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState({
    isOpen: false,
    severity: "success",
    snackbarAlertMessage: "Added!",
  });
  const [turbineArray, setTurbineArray] = useState([]);
  const [subsystemArray, setsubsystemArray] = useState([]);
  const [tableData, setTableData] = useState([]);
  const faultTypeArray = ["Minor", "Major"];

  const handleCloseAlert = () => {
    setOpenSnackbarAlert({ ...openSnackbarAlert, ...{ isOpen: false } });
  };

  const RandomizeTable = () => {
    let tempTurbineArray = turbineArray.slice();
    let tempTableData = [];

    for (let index = 0; index < refTurbineNumber.current.value; index++) {
      const randomTurbine =
        tempTurbineArray[Math.floor(Math.random() * tempTurbineArray.length)]
          .turbine_name;

      tempTurbineArray = tempTurbineArray
        .filter((value) => value.turbine_name != randomTurbine)
        .slice();

      const randomSubsystem =
        subsystemArray[Math.floor(Math.random() * subsystemArray.length)]
          .subsystem_name;

      const randomFaultType =
        faultTypeArray[Math.floor(Math.random() * faultTypeArray.length)];

      tempTableData.push({
        turbineName: randomTurbine,
        subsystemName: randomSubsystem,
        faultType: randomFaultType,
      });
    }

    setTableData(tempTableData);
  };

  const clearTableData = () => {
    setTableData([]);
  };

  let windTurbineIconObj = L.icon({
    ...L.Icon.Default.prototype.options,
    iconUrl: windTurbineIcon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
  });
  L.Marker.prototype.options.icon = windTurbineIconObj;

  let dockIconObj = L.icon({
    ...L.Icon.Default.prototype.options,
    iconUrl: dockIcon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
  });

  const {
    isLoading: isLoadingMap,
    error: errorOnMap,
    data: mapData,
    isFetching: isFetchingMap,
    isSuccess: mapDataLoaded,
  } = useQuery(["mapData"], () => getTurbineMapData().then((res) => res.data));

  const {
    isLoading: isLoadingSubsystem,
    error: errorOnSubsystem,
    data: subsystemData,
    isFetching: isFetchingSubsystem,
    isSuccess: subsystemDataLoaded,
  } = useQuery(["subsystemData"], () =>
    getSubsystemData().then((res) => res.data)
  );

  useEffect(() => {
    if (mapData) {
      setTurbineArray(
        mapData
          .filter((value) => value.turbine_name != "Doca")
          .map((value) => ({
            turbine_id: value.turbine_id,
            turbine_name: value.turbine_name,
          }))
      );
    }
  }, [mapDataLoaded]);

  useEffect(() => {
    if (subsystemData) {
      setsubsystemArray(subsystemData);
    }
  }, [subsystemDataLoaded]);

  const addRowToTable = (event) => {
    event.preventDefault();

    let tempTable = tableData.slice();
    const turbineName = refTurbineNameInput.current.value;

    const checkIfIsAdded = tempTable.filter(
      (value) => value.turbineName == turbineName
    );

    if (checkIfIsAdded.length > 0) {
      setOpenSnackbarAlert({
        isOpen: true,
        severity: "error",
        snackbarAlertMessage: "Turbine is already on table!",
      });
    } else {
      tempTable.push({
        turbineName: turbineName,
        subsystemName: refSubsystemNameInput.current.value,
        faultType: refFaultType.current.value,
      });
      setTableData(tempTable);
      setOpenSnackbarAlert({
        isOpen: true,
        severity: "success",
        snackbarAlertMessage: "Added!",
      });
    }
  };

  // const option = {
  //   title: {
  //     text: "Stacked Line",
  //   },
  //   backgroundColor: "transparent",
  //   tooltip: {
  //     trigger: "axis",
  //   },
  //   legend: {
  //     data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
  //   },
  //   grid: {
  //     left: "3%",
  //     right: "4%",
  //     bottom: "3%",
  //     containLabel: true,
  //   },
  //   toolbox: {
  //     //   feature: {
  //     //     saveAsImage: false,
  //     //   },
  //   },
  //   xAxis: {
  //     type: "category",
  //     boundaryGap: false,
  //     data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  //   },
  //   yAxis: {
  //     type: "value",
  //   },
  //   series: [
  //     {
  //       name: "Email",
  //       type: "line",
  //       stack: "Total",
  //       data: [120, 132, 101, 134, 90, 230, 210],
  //     },
  //     {
  //       name: "Union Ads",
  //       type: "line",
  //       stack: "Total",
  //       data: [220, 182, 191, 234, 290, 330, 310],
  //     },
  //     {
  //       name: "Video Ads",
  //       type: "line",
  //       stack: "Total",
  //       data: [150, 232, 201, 154, 190, 330, 410],
  //     },
  //     {
  //       name: "Direct",
  //       type: "line",
  //       stack: "Total",
  //       data: [320, 332, 301, 334, 390, 330, 320],
  //     },
  //     {
  //       name: "Search Engine",
  //       type: "line",
  //       stack: "Total",
  //       data: [820, 932, 901, 934, 1290, 1330, 1320],
  //     },
  //   ],
  // };

  const columns = [
    {
      name: "turbineName",
      label: "Turbine",
      // options: {
      //   display: false,
      // },
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
        }),
        setCellProps: (value) => {
          return {
            style: {
              textAlign: "center",
            },
          };
        },
      },
    },
    {
      name: "subsystemName",
      label: "Subsystem",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
        }),
        setCellProps: (value) => {
          return {
            style: {
              textAlign: "center",
            },
          };
        },
      },
    },
    {
      name: "faultType",
      label: "Fault Type",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
        }),
        setCellProps: (value) => {
          return {
            style: {
              textAlign: "center",
            },
          };
        },
      },
    },
    {
      name: "action",
      label: " ",
      options: {
        filter: false,
        sort: false,
        viewColumns: false,
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
        }),
        setCellProps: (value) => {
          return {
            style: {
              textAlign: "center",
            },
          };
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          const rowIndex = tableMeta.currentTableData[tableMeta.rowIndex].index;
          return (
            <MuiTooltip title="Remove">
              <IconButton
                onClick={(e) => {
                  // clickWalletDelete(e, tableMeta.tableData[rowIndex].walletId)
                  const turbineName = tableMeta.tableData[rowIndex].turbineName;
                  // console.log(turbineName);
                  let tempTable = tableData.filter(
                    (value, index) => value.turbineName !== turbineName
                  );
                  setTableData(tempTable);
                }}
                aria-label="delete"
              >
                <Delete fontSize="small" style={{ color: "red" }} />
              </IconButton>
            </MuiTooltip>
          );
        },
      },
    },
  ];

  const tableOptions = {
    filterType: "dropdown",
    download: false,
    print: false,
    rowsPerPage: 100,
    rowsPerPageOptions: [], //[10, 15, 25, 50, 100],
    selectableRows: "none",
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{ width: 500 }}>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            open={openSnackbarAlert.isOpen}
            autoHideDuration={4000}
            onClose={handleCloseAlert}
          >
            <Alert
              onClose={handleCloseAlert}
              severity={openSnackbarAlert.severity}
              sx={{ width: "100%" }}
            >
              {openSnackbarAlert.snackbarAlertMessage}
            </Alert>
          </Snackbar>
        </Box>
        <Card style={{ marginBottom: "30px" }}>
          <CardHeader
            // avatar={<Avatar aria-label="recipe">R</Avatar>}
            // action={
            //   <IconButton aria-label="settings">
            //     <MoreVertIcon />
            //   </IconButton>
            // }
            title="Ant Colony"
            titleTypographyProps={{ variant: "h6" }}
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& > :not(style)": { m: 1, mt: 2, width: "100%" },
              }}
            >
              <FormControl>
                <InputLabel id="select-turbine">Turbine</InputLabel>
                <Select
                  labelId="select-turbine"
                  id="select-turbine"
                  label="Turbine"
                  size="small"
                  inputRef={refTurbineNameInput}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {turbineArray.map((turbine, index) => (
                    <MenuItem
                      key={turbine.turbine_id}
                      value={turbine.turbine_name}
                    >
                      {turbine.turbine_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="select-subsystem">Subsystem</InputLabel>
                <Select
                  labelId="select-subsystem"
                  id="select-subsystem"
                  label="Subsystem"
                  size="small"
                  inputRef={refSubsystemNameInput}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {subsystemArray.map((subsystem, index) => (
                    <MenuItem
                      key={subsystem.subsystem_id}
                      value={subsystem.subsystem_name}
                    >
                      {subsystem.subsystem_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="select-fault-type">Fault Type</InputLabel>
                <Select
                  labelId="select-fault-type"
                  id="select-fault-type"
                  label="Fault Type"
                  size="small"
                  defaultValue={faultTypeArray[0]}
                  inputRef={refFaultType}
                >
                  {faultTypeArray.map((faultType, index) => (
                    <MenuItem key={index} value={faultType}>
                      {faultType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                size="small"
                sx={{ maxWidth: "20%" }}
                onClick={addRowToTable}
              >
                Add to table
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                "& > :not(style)": { m: 1, mt: 1, width: "25%" },
              }}
            >
              <FormControl>
                <TextField
                  variant="standard"
                  label="Nº of turbines"
                  defaultValue={1}
                  focused
                  InputProps={{
                    inputProps: {
                      type: "number",
                      min: 1,
                      max: turbineArray.length > 0 ? turbineArray.length : 200,
                    },
                  }}
                  inputRef={refTurbineNumber}
                />
              </FormControl>
              <Button
                variant="contained"
                startIcon={<Shuffle />}
                color="warning"
                size="small"
                sx={{ maxWidth: "20%" }}
                onClick={RandomizeTable}
              >
                Randomize
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                "& > :not(style)": { m: 1, mt: 1, width: "25%" },
              }}
            >
              <Button
                variant="contained"
                startIcon={<ClearAll />}
                color="info"
                size="small"
                sx={{ maxWidth: "20%" }}
                onClick={clearTableData}
              >
                Clear table
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& > :not(style)": { m: 1, mt: 1, width: "100%" },
              }}
            >
              <MUIDataTable
                // title={"Employee List"}
                data={tableData}
                columns={columns}
                options={tableOptions}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                "& > :not(style)": { m: 1, mt: 1, width: "15%" },
              }}
            >
              <Button
                variant="contained"
                startIcon={<PlayCircle />}
                color="success"
                size="small"
              >
                Run
              </Button>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <MapContainer
              center={[-4.85229214062265, -36.7854686438628]}
              zoom={11}
              scrollWheelZoom={true}
              style={{ height: "80vh", width: "100wh" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              {/* <Marker position={[51.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker> */}
              {mapData?.map((map_point) => (
                <Marker
                  key={map_point.turbine_id}
                  position={[map_point.latitude, map_point.longitude]}
                  icon={
                    map_point.turbine_id == 1 ? dockIconObj : windTurbineIconObj
                  }
                >
                  {/* <Popup>{map_point.turbine_name}</Popup> */}
                  <Tooltip>{map_point.turbine_name}</Tooltip>
                </Marker>
              ))}
            </MapContainer>
            {/*  <ReactECharts
              option={option}
              theme={chartTheme}
              style={{ height: 300 }}
            />
             <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Word of the Day
            </Typography>
            <Typography variant="h5" component="div">
              belent
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              adjective
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography> */}
          </CardContent>
          {/* <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions> */}
        </Card>
      </Grid>
    </Grid>
  );
}

export { Dashboard };
