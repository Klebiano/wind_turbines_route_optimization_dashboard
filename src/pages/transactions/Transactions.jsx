import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Grid,
  useTheme,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { CardHeader, Divider } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import ReactECharts from "echarts-for-react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import MUIDataTable from "mui-datatables";
import "./Styles.css";
import {
  getTransactionsData,
  // createWallet,
  // deleteWallet,
} from "../../api/transactions/TransactionsAPI";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Transactions() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [openModal, setModalOpen] = useState(false);
  const [userId, setUserId] = useState(1);
  const [walletId, setWalletId] = useState(null);
  const [newWalletTitle, setNewWalletTitle] = useState("");
  const [newWalletDescription, setNewWalletDescription] = useState("");
  const [tableData, setTableData] = useState([]);

  const handleClickOpen = () => () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const {
    isLoading: isLoadingTransactionsData,
    error: transactionsDataError,
    data: transactionsData,
    isFetching: isFetchingTransactionsData,
  } = useQuery(["transactionsData", { userId: userId }], getTransactionsData);

  //   useEffect(() => {
  //     var tableTemp = [];
  //     if (walletData) {
  //       walletData.forEach((row) => {
  //         tableTemp.push({
  //           walletId: row.id,
  //           title: row.title,
  //           description: row.description,
  //           action: null,
  //         });
  //       });
  //     }

  //     setTableData(tableTemp);
  //   }, [walletData]);

  // const createNewWallet = useMutation((data) => {
  //   createWallet(data);
  //   setModalOpen(false);
  //   queryClient.invalidateQueries(["walletData"]);
  // });

  // const deleteUserWallet = useMutation((data) => {
  //   deleteWallet(data);
  //   queryClient.invalidateQueries(["walletData"]);
  // });

  // const onSubmit = (event) => {
  //   event.preventDefault();
  //   createNewWallet.mutate({
  //     userId: userId,
  //     walletData: {
  //       title: newWalletTitle,
  //       description: newWalletDescription,
  //     },
  //   });
  // };

  // const clickWalletDelete = (event, id) => {
  //   event.preventDefault();
  //   deleteUserWallet.mutate({
  //     userId: userId,
  //     walletId: id,
  //   });
  // };

  const columns = [
    {
      name: "transactionId",
      label: "Transaction Id",
      options: {
        display: false,
      },
    },
    {
      name: "category",
      label: "Category",
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
      name: "asset",
      label: "Asset",
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
      name: "orderType",
      label: "Order Type",
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
      name: "walletTitle",
      label: "Wallet",
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
      name: "date",
      label: "Date",
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
      name: "quantity",
      label: "Quantity",
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
      name: "price",
      label: "Price",
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
      name: "total",
      label: "Total",
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
          const rowIndex = tableMeta.rowIndex;
          return (
            <Tooltip title="Remove">
              <IconButton
                onClick={(e) =>
                  // clickWalletDelete(e, tableMeta.tableData[rowIndex].walletId)
                  console.log()
                }
                aria-label="delete"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          );
        },
      },
    },
  ];

  const tableOptions = {
    filterType: "dropdown",
    download: false,
    print: false,
    rowsPerPage: 50,
    rowsPerPageOptions: [10, 15, 25, 50, 100],
    selectableRows: "none",
  };

  return (
    <Grid container>
      <Grid item xs={12} align="end">
        <Button onClick={handleClickOpen()}>
          <AddCircleIcon sx={{ mr: 1 }} />
          Add new transaction
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Transactions"
            titleTypographyProps={{ variant: "h6" }}
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            <MUIDataTable
              // title={"Employee List"}
              data={tableData}
              columns={columns}
              options={tableOptions}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export { Transactions };
