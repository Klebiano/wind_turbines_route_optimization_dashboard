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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ReactECharts from "echarts-for-react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import MUIDataTable from "mui-datatables";
import "./Styles.css";
import {
  getWalletData,
  createWallet,
  deleteWallet,
} from "../../api/wallets/WalletsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Wallets() {
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
    isLoading: isLoadingWalletData,
    error: walletDataError,
    data: walletData,
    isFetching: isFetchingWalletData,
  } = useQuery(["walletData", { userId: userId }], getWalletData);

  useEffect(() => {
    var tableTemp = [];
    if (walletData) {
      walletData.forEach((row) => {
        tableTemp.push({
          walletId: row.id,
          title: row.title,
          description: row.description,
          action: null,
        });
      });
    }

    setTableData(tableTemp);
  }, [walletData]);

  const createNewWallet = useMutation((data) => {
    createWallet(data);
    setModalOpen(false);
    queryClient.invalidateQueries(["walletData"]);
  });

  const deleteUserWallet = useMutation((data) => {
    deleteWallet(data);
    queryClient.invalidateQueries(["walletData"]);
  });

  const onSubmit = (event) => {
    event.preventDefault();
    createNewWallet.mutate({
      userId: userId,
      walletData: {
        title: newWalletTitle,
        description: newWalletDescription,
      },
    });
  };

  const clickWalletDelete = (event, id) => {
    event.preventDefault();
    deleteUserWallet.mutate({
      userId: userId,
      walletId: id,
    });
  };

  const columns = [
    {
      name: "walletId",
      label: "wallet Id",
      options: {
        display: false,
      },
    },
    {
      name: "title",
      label: "Title",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: (value) => ({
          // style: { backgroundColor: "gray" },
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
      name: "description",
      label: "Description",
      options: {
        filter: true,
        sort: true,
        // display: false,
        setCellHeaderProps: (value) => ({
          // style: { backgroundColor: "gray" },
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
          // style: { backgroundColor: "gray" },
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
                  clickWalletDelete(e, tableMeta.tableData[rowIndex].walletId)
                }
                aria-label="delete"
              >
                <DeleteIcon />
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
          Add wallet
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Wallets"
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
      <div>
        <Dialog
          open={openModal}
          onClose={handleClose}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="scroll-dialog-title">Add new wallet</DialogTitle>
          <DialogContent dividers={true}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& > :not(style)": { m: 1 },
              }}
            >
              <TextField
                variant="standard"
                label="Title"
                onChange={(e) => setNewWalletTitle(e.target.value)}
                focused
              />
              <TextField
                variant="standard"
                label="Description"
                onChange={(e) => setNewWalletDescription(e.target.value)}
                focused
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={onSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Grid>
  );
}

export { Wallets };
