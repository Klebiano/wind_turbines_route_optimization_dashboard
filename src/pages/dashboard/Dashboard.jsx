import { useState, useEffect, useRef, Fragment } from "react";
// import Avatar from "@mui/material/Avatar";
import {
  AddCircle,
  PlayCircle,
  Shuffle,
  Delete,
  ClearAll,
  DeleteSweep,
  ArrowForward
} from "@mui/icons-material";
// import Typography from "@mui/material/Typography";
// import ReactECharts from "echarts-for-react";
import {
  getTurbineMapData,
  getSubsystemData,
  runRouteOptimizer,
} from "../../api/dashboard/DashboardApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import L from "leaflet";
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
  Polyline
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
  Stack,
  Tooltip as MuiTooltip,
  Typography,
  CircularProgress,
} from "@mui/material";

function weighted_random(items, weights) {
  var i;

  for (i = 1; i < weights.length; i++){
    weights[i] += weights[i - 1];
  }
  
  var random = Math.random() * weights[weights.length - 1];
  
  for (i = 0; i < weights.length; i++){
    if (weights[i] > random) break;
  }
  
  return items[i];
}

function Dashboard() {
  const theme = useTheme();
  const chartTheme = theme.palette.mode === "dark" ? "dark" : "westeros";
  const queryClient = useQueryClient();
  const refTurbineNameInput = useRef("");
  const refSubsystemNameInput = useRef("");
  const refFaultType = useRef("");
  const refTurbineNumber = useRef("");
  const refAlgorithm = useRef("");
  const [isLoadingAntColonyAlgorithm, setIsLoadingAntColonyAlgorithm] = useState(false);
  const [mapPolylineList, setMapPolylineList] = useState([]);
  const [turbineOrderList, setTurbineOrderList] = useState([]);
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

  const runRouteAlgorithm = async () => {
    setIsLoadingAntColonyAlgorithm(true);
    try {
      let algorithm = refAlgorithm.current?.value || "Genetic";
      const response = await runRouteOptimizer(tableData, algorithm);

      if (response && response.status === 200) {
        const response_data = response.data;
        const turbine_order = response_data.turbine_order || [];
        const turbine_order_to_show = response_data.turbine_order_to_show || [];
        let turbine_order_map_data = [];

        turbine_order.forEach(turbine_name => {
          const single_map_data = mapData?.find(element => element.turbine_name === turbine_name);
          if (single_map_data) {
            turbine_order_map_data.push([single_map_data.latitude, single_map_data.longitude]);
          }
        });

        setMapPolylineList(turbine_order_map_data);
        setTurbineOrderList(turbine_order_to_show);
      } else {
        setOpenSnackbarAlert({
          isOpen: true,
          severity: "error",
          snackbarAlertMessage: "Error running the algorithm!",
        });
      }
    } catch (error) {
      setOpenSnackbarAlert({
        isOpen: true,
        severity: "error",
        snackbarAlertMessage: error.response?.data?.message || "Failed to execute optimizer endpoint!",
      });
    } finally {
      setIsLoadingAntColonyAlgorithm(false);
    }
  };

  const RandomizeTable = () => {
    if (!turbineArray.length || !subsystemArray.length) return;
    let tempTurbineArray = turbineArray.slice();
    let tempTableData = [];
    const count = parseInt(refTurbineNumber.current?.value || "1", 10);

    for (let index = 0; index < count && tempTurbineArray.length > 0; index++) {
      const randomTurbine =
        tempTurbineArray[Math.floor(Math.random() * tempTurbineArray.length)]
          .turbine_name;

      const turbineId = turbineArray.filter(
        (value) => value.turbine_name === randomTurbine
      )[0].turbine_id;

      tempTurbineArray = tempTurbineArray
        .filter((value) => value.turbine_name !== randomTurbine)
        .slice();

      const randomSubsystem =
        subsystemArray[Math.floor(Math.random() * subsystemArray.length)]
          .subsystem_name;

      const randomFaultType = weighted_random(faultTypeArray, [0.90, 0.10]);

      tempTableData.push({
        turbine_id: turbineId,
        turbine_name: randomTurbine,
        subsystem_name: randomSubsystem,
        fault_type: randomFaultType,
      });
    }

    setTableData(tempTableData);
  };

  const clearTableData = () => {
    setTableData([]);
  };

  const windTurbineIconObj = L.icon({
    ...L.Icon.Default.prototype.options,
    iconUrl: windTurbineIcon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
  });

  const dockIconObj = L.icon({
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

  // const runAntColony = useMutation(() => {
  //   console.log(tableData);
  //   // runRouteAlgorithm(tableData, "Genetic");
  //   // setModalOpen(false);
  //   // queryClient.invalidateQueries(["walletData"]);
  // });

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
    const turbine_name = refTurbineNameInput.current.value;

    const checkIfIsAdded = tempTable.filter(
      (value) => value.turbine_name == turbine_name
    );

    const turbine_id = turbineArray.filter(
      (value) => value.turbine_name === turbine_name
    )[0].turbine_id;

    if (checkIfIsAdded.length > 0) {
      setOpenSnackbarAlert({
        isOpen: true,
        severity: "error",
        snackbarAlertMessage: "Turbine is already on table!",
      });
    } else {
      tempTable.push({
        turbine_id: turbine_id,
        turbine_name: turbine_name,
        subsystem_name: refSubsystemNameInput.current.value,
        fault_type: refFaultType.current.value,
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
      name: "turbine_id",
      label: "Turbine Id",
      options: {
        display: false,
      },
    },
    {
      name: "turbine_name",
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
      name: "subsystem_name",
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
      name: "fault_type",
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
                  const turbine_name =
                    tableMeta.tableData[rowIndex].turbine_name;
                  let tempTable = tableData.filter(
                    (value, index) => value.turbine_name !== turbine_name
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
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 15, 25, 50, 100],
    selectableRows: "none",
    setTableProps: () => {
      return {
        // material ui v4 only
        size: 'small',
      };
    }
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
            title="Optimize Routes"
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
              <FormControl>
                <InputLabel id="select-algorithm">Algorithm</InputLabel>
                <Select
                  labelId="select-algorithm"
                  id="select-algorithm"
                  label="Algorithm"
                  size="small"
                  defaultValue={"Genetic"}
                  inputRef={refAlgorithm}
                >
                  {["Genetic", "Memetic", "Ant Colony"].map((algorithm, index) => (
                    <MenuItem key={index} value={algorithm}>
                      {algorithm}
                    </MenuItem>
                  ))}
                </Select>
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
                // startIcon={<PlayCircle />}
                color="success"
                size="small"
                onClick={(event) => {runRouteAlgorithm()}}
                sx={{
                  display: "flex",
                  justifyContent: "flex-center",
                  alignItems: "flex-center",
                }}
              >
                {isLoadingAntColonyAlgorithm === true ? 
                  <CircularProgress size="1.5rem" color="inherit" /> : 
                  <Stack direction="row" alignItems="center" gap={1}>
                    <PlayCircle />
                    <Typography variant="body2">Run</Typography>
                  </Stack>
              }
              </Button>
              {mapPolylineList.length > 0 ? 
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={(event) => {setMapPolylineList([]); setTurbineOrderList([])}}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-center",
                    alignItems: "flex-center",
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <DeleteSweep />
                    <Typography variant="body2" noWrap>Clear Results</Typography>
                  </Stack>
                </Button> : ''
              }
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
              // style={{ height: "550px", width: "1000px" }}
            >
              <TileLayer
                //attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              {/* <Marker position={[51.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker> */}
              <Polyline pathOptions={{ color: 'lime' }} positions={mapPolylineList} />
              {/* {mapPolylineList.length > 0 ? 
                <Polyline pathOptions={{color: 'purple'}} positions={ [...[mapPolylineList[mapPolylineList.length - 1]], ...[mapPolylineList[0]]]} /> : ''
              } */}
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
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              adjective
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography> */}
            <Typography fontFamily={'Segoe UI'} component="div" sx={{ mt: 2}}>
              {turbineOrderList.map((turbine_name, index) => (
                <Fragment key={index}>
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Box component="span" sx={{
                        backgroundColor: '#e0e0e0', // Light gray background similar to a button
                        borderRadius: '20px', // Rounded borders
                        padding: '5px 8px', // Padding to look like a button
                        marginRight: '8px', // Spacing between buttons
                        fontSize: '13px',
                        color: '#424242', // Darker text color
                        border: '1px solid #bdbdbd', // Border to mimic a button
                        cursor: "default"
                      }}
                    >
                      {turbine_name}
                    </Box>
                    {index < turbineOrderList.length - 1 && (
                      <ArrowForward sx={{ mx: 1, verticalAlign: 'middle'}} /> 
                    )}
                  </Box>
                  {(index + 1) % 8 === 0 && <Box component="div" sx={{ mt: 1 }}></Box>}
                </Fragment>
              ))}
            </Typography>
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
