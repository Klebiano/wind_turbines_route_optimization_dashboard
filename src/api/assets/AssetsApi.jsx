import apiClient from "../config";

const getAssetData = async () => {
  const res = await apiClient.get("/assets/");
  return res.data;
};

const createNewAsset = async (data) => {
  return await apiClient.post("/assets/", {
    ...data.assetData,
  });
};

const editNewAsset = async (data) => {
  return await apiClient.patch(`/assets/${data.assetID}`, {
    ...data.assetData,
  });
};

const deleteNewAsset = async (data) => {
  return await apiClient.delete(`/assets/${data.assetID}`);
};

const getDollarRealQuote = async () => {
  const res = await apiClient.get("/get-currency/USD-BRL");
  return res.data;
};

export {
  getDollarRealQuote,
  getAssetData,
  createNewAsset,
  editNewAsset,
  deleteNewAsset,
};
