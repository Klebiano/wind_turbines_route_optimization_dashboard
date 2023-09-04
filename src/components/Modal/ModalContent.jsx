import { Fragment, useState, useRef } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useEffect } from "react";

function ModalContent(props) {
  const currencies = ["BRL", "USD", "EUR"];
  const assetTypes = [
    "Ação",
    "Fundos imobiliários",
    "Stocks",
    "REITS",
    "Euro Stocks",
  ];

  useEffect(() => {
    if (props.editTableInfo) {
      props.refAssetTickerInput.current.value = props.editTableInfo.ticker;
      props.refAssetNameInput.current.value = props.editTableInfo.name;
    }
  }, []);

  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          "& > :not(style)": { m: 1 },
        }}
      >
        <TextField
          variant="standard"
          label="Ticker"
          inputRef={props.refAssetTickerInput}
          focused
        />
        <TextField
          variant="standard"
          label="Name"
          inputRef={props.refAssetNameInput}
          focused
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          "& > :not(style)": { m: 1, mt: 2, width: "100%" },
        }}
      >
        <FormControl>
          <InputLabel id="select-currency">Currency</InputLabel>
          <Select
            labelId="select-currency"
            id="select-currency"
            label="Currency"
            inputRef={props.refSelectedCurrency}
            defaultValue={
              props.editTableInfo ? props.editTableInfo.unit : currencies[0]
            }
          >
            {currencies.map((currency, index) => (
              <MenuItem key={index} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          "& > :not(style)": { m: 1, mt: 2, width: "100%" },
        }}
      >
        <FormControl>
          <InputLabel id="select-asset-type">Type</InputLabel>
          <Select
            labelId="select-asset-type"
            id="select-asset-type"
            label="Type"
            inputRef={props.refSelectedAssetType}
            defaultValue={
              props.editTableInfo ? props.editTableInfo.type : assetTypes[0]
            }
          >
            {assetTypes.map((assetType, index) => (
              <MenuItem key={index} value={assetType}>
                {assetType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Fragment>
  );
}

export { ModalContent };
