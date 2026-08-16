import apiClient from "../config";

const getTransactionsData = async ({ queryKey }) => {
  const res = await apiClient.get("/transactions");
  return res.data;
};

// const createWallet = async (data) => {
//   return await apiClient.post(
//     `/users/${data.userId}/wallets/`,
//     {
//       ...data.walletData,
//     }
//   );
// };
// 
// const deleteWallet = async (data) => {
//   return await apiClient.delete(
//     `/users/${data.userId}/wallets/${data.walletId}`
//   );
// };

export { getTransactionsData };
