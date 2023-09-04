import axios from "axios";

const fetchData = async () => {
  return await axios.get("http://127.0.0.1:8000/get-data");
};

export { fetchData };
