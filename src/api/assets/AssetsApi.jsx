import axios from "axios";

const getAssetData = async () => {
  const res = await axios.get(`http://127.0.0.1:8000/assets/`);
  return res.data;
};

const createNewAsset = async (data) => {
  return await axios.post(`http://127.0.0.1:8000/assets/`, {
    ...data.assetData,
  });
};

const editNewAsset = async (data) => {
  return await axios.patch(`http://127.0.0.1:8000/assets/${data.assetID}`, {
    ...data.assetData,
  });
};

const deleteNewAsset = async (data) => {
  return await axios.delete(`http://127.0.0.1:8000/assets/${data.assetID}`);
};

const getDollarRealQuote = async () => {
  const res = await axios.get(`http://127.0.0.1:8000/get-currency/USD-BRL`);
  return res.data;
};

export {
  getDollarRealQuote,
  getAssetData,
  createNewAsset,
  editNewAsset,
  deleteNewAsset,
};
