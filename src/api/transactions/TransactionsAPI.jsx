import axios from "axios";

const getTransactionsData = async ({ queryKey }) => {
  const res = await axios.get(`http://127.0.0.1:8000/transactions`);
  return res.data;
};

// const createWallet = async (data) => {
//   return await axios.post(
//     `http://127.0.0.1:8000/users/${data.userId}/wallets/`,
//     {
//       ...data.walletData,
//     }
//   );
// };

// const deleteWallet = async (data) => {
//   return await axios.delete(
//     `http://127.0.0.1:8000/users/${data.userId}/wallets/${data.walletId}`
//   );
// };

export { getTransactionsData };
