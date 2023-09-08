import axios from "axios";

const getTurbineMapData = async () => {
  return await axios.get("http://127.0.0.1:8000/ant-colony/get-turbines-map");
};

const getSubsystemData = async () => {
  return await axios.get("http://127.0.0.1:8000/ant-colony/get-subsystems");
};

export { getTurbineMapData, getSubsystemData };
