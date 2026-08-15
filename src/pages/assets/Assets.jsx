import {
  Box,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogTitle,
  // DialogContentText,
  Grid,
  useTheme,
  // TextField,
  Tooltip,
  // MenuItem,
  // Select,
  // InputLabel,
  // OutlinedInput,
  // FormControl,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { CardHeader, Divider } from "@mui/material";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MUIDataTable from "mui-datatables";
import "./Styles.css";
import {
  getDollarRealQuote,
  getAssetData,
  createNewAsset,
  editNewAsset,
  deleteNewAsset,
} from "../../api/assets/AssetsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AttachMoney, TrendingDown, TrendingUp } from "@mui/icons-material";
import { Fragment } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorIcon from "@mui/icons-material/Error";
import DeleteIcon from "@mui/icons-material/Delete";
import { ModalComponent } from "../../components/Modal/Modal";
import { ModalContent } from "../../components/Modal/ModalContent";
import { ModalActions } from "../../components/Modal/ModalActions";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

function Assets() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [openModal, setModalOpen] = useState(false);
  //   const [assetID, setAssetID] = useState(null);
  const assetID = useRef();
  const refAssetNameInput = useRef("");
  const refAssetTickerInput = useRef("");
  const refSelectedCurrency = useRef("");
  const refSelectedAssetType = useRef("");
  const [editTableInfo, setEditTableInfo] = useState(null);
  //   const [submitText, setSubmitText] = useState("Submit");

  const [modalSubmitAction, setModalSubmitAction] = useState("");
  const [tableData, setTableData] = useState([]);

  const handleClickOpen = (action) => {
    if (action === "create") {
      setModalSubmitAction("create");
    } else if (action === "edit") {
      setModalSubmitAction("edit");
    }
    setModalOpen(true);
  };

  // Reloads currency quote every 10 minutes
  const {
    statusCurrency: currencyAPIStatus,
    isLoading: isLoadingCurrencyData,
    error: currencyDataError,
    data: currencyData,
    isFetching: isFetchingCurrencyData,
  } = useQuery(["currencyQuoteData"], getDollarRealQuote, {
    refetchInterval: 600000,
  });

  // Loads the assets data
  const {
    statusAssets: assetStatus,
    isLoading: isLoadingAssetsData,
    error: assetsError,
    data: assetsData,
    isFetching: isFetchingAssetsData,
  } = useQuery(["assetsData"], getAssetData);

  useEffect(() => {
    var tableTemp = [];
    if (assetsData) {
      assetsData.forEach((row) => {
        tableTemp.push({
          assetID: row.asset_id,
          ticker: row.asset_ticker,
          name: row.asset_name,
          unit: row.currency_unit,
          type: row.asset_type_name,
          action: null,
        });
      });
    }
    setTableData(tableTemp);
  }, [assetsData]);

  const createAsset = useMutation((data) => {
    return createNewAsset(data).then((response) => {
      //   setModalOpen(false);
      queryClient.invalidateQueries(["assetsData"]);
    });
  });

  const editAsset = useMutation((data) => {
    return editNewAsset(data).then((data) => {
      //   setModalOpen(false);
      queryClient.invalidateQueries(["assetsData"]);
    });
  });

  const deleteAsset = useMutation((data) => {
    return deleteNewAsset(data).then((data) => {
      queryClient.invalidateQueries(["assetsData"]);
    });
  });

  const onSubmit = (event) => {
    event.preventDefault();
    createAsset.mutate({
      assetData: {
        ticker: refAssetTickerInput.current.value,
        name: refAssetNameInput.current.value,
        unit: refSelectedCurrency.current.value,
        type: refSelectedAssetType.current.value,
      },
    });
  };

  const clickAssetEdit = (event) => {
    event.preventDefault();
    editAsset.mutate({
      assetID: assetID.current,
      assetData: {
        ticker: refAssetTickerInput.current.value,
        name: refAssetNameInput.current.value,
        unit: refSelectedCurrency.current.value,
        type: refSelectedAssetType.current.value,
      },
    });
  };

  const clickAssetDelete = (event, id) => {
    event.preventDefault();
    deleteAsset.mutate({
      assetID: id,
    });
  };

  const clickedFunction =
    modalSubmitAction === "create"
      ? createAsset
      : modalSubmitAction === "edit"
      ? editAsset
      : null;

  const submitText = (
    <div>
      {clickedFunction ? (
        clickedFunction.isLoading ? (
          <CircularProgress size={20} />
        ) : (
          <div>
            {clickedFunction.isError ? (
              <div>
                <Tooltip
                  title={
                    <div>
                      {clickedFunction.error?.message}
                      <br />
                      {clickedFunction.error?.response?.data?.detail}
                    </div>
                  }
                  arrow
                >
                  <ErrorIcon sx={{ color: "red" }} />
                </Tooltip>
              </div>
            ) : (
              <div>Submit</div>
            )}
          </div>
        )
      ) : (
        "Submit"
      )}
    </div>
  );

  const modalContentProps = {
    refAssetNameInput,
    refAssetTickerInput,
    refSelectedCurrency,
    refSelectedAssetType,
    editTableInfo,
  };

  const modalActionsProps = {
    modalSubmitAction,
    onSubmit,
    submitText,
    clickAssetEdit,
    setModalOpen,
  };

  const tableOptions = {
    filterType: "dropdown",
    download: false,
    print: false,
    rowsPerPage: 100,
    rowsPerPageOptions: [10, 15, 25, 50, 100, 150, 200],
    selectableRows: "none",
  };

  const tableColumns = [
    {
      name: "assetID",
      label: "Asset ID",
      options: {
        display: false,
        viewColumns: false,
        filter: false,
      },
    },
    {
      name: "ticker",
      label: "Ticker",
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
      name: "name",
      label: "Name",
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
      name: "unit",
      label: "Unit",
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
      name: "type",
      label: "Type",
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
          return (
            <div>
              <Tooltip title="Edit">
                <IconButton
                  onClick={(e) => {
                    const rowIndex =
                      tableMeta.currentTableData[tableMeta.rowIndex].index;
                    setEditTableInfo(tableMeta.tableData[rowIndex]);
                    assetID.current = tableMeta.tableData[rowIndex].assetID;
                    handleClickOpen("edit");
                  }}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  onClick={(e) => {
                    const rowIndex =
                      tableMeta.currentTableData[tableMeta.rowIndex].index;
                    clickAssetDelete(e, tableMeta.tableData[rowIndex].assetID);
                  }}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
    },
  ];

  return (
    <Grid container>
      <Grid item xs={6} align="start">
        <AttachMoney />
        <Box component="span" sx={{ m: 1, display: "inline" }}>
          {!currencyData
            ? ""
            : parseFloat(currencyData.USDBRL.bid).toFixed(2).replace(".", ",")}
        </Box>
        {!currencyData ? (
          ""
        ) : currencyData.USDBRL.pctChange > 0 ? (
          <Tooltip title={currencyData.USDBRL.pctChange + "%"} arrow>
            <TrendingUp sx={{ color: "green" }} />
          </Tooltip>
        ) : (
          <Tooltip title={currencyData.USDBRL.pctChange + "%"} arrow>
            <TrendingDown sx={{ color: "red" }} />
          </Tooltip>
        )}
      </Grid>
      <Grid item xs={6} align="end">
        <Button
          onClick={(e) => {
            setEditTableInfo(null);
            handleClickOpen("create");
          }}
        >
          <AddCircleIcon sx={{ mr: 1 }} />
          Add new asset
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Assets" titleTypographyProps={{ variant: "h6" }} />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            <MUIDataTable
              // title={"Employee List"}
              data={tableData}
              columns={tableColumns}
              options={tableOptions}
            />
          </CardContent>
        </Card>
      </Grid>
      <div>
        <ModalComponent
          isDialogOpened={openModal}
          handleCloseDialog={() => setModalOpen(false)}
          modalTitle={
            modalSubmitAction === "create"
              ? "Add new asset"
              : modalSubmitAction === "edit"
              ? "Edit asset"
              : ""
          }
          ModalContent={<ModalContent {...modalContentProps} />}
          ModalActions={<ModalActions {...modalActionsProps} />}
        />
      </div>
    </Grid>
  );
}

export { Assets };
