import apiClient from "../config";

const getWalletData = async ({ queryKey }) => {
  const res = await apiClient.get(
    `/users/${queryKey[1].userId}/wallets/`
  );
  return res.data;
};

const createWallet = async (data) => {
  return await apiClient.post(
    `/users/${data.userId}/wallets/`,
    {
      ...data.walletData,
    }
  );
};

const deleteWallet = async (data) => {
  return await apiClient.delete(
    `/users/${data.userId}/wallets/${data.walletId}`
  );
};

export { getWalletData, createWallet, deleteWallet };
