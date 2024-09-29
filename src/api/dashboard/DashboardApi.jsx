import axios from "axios";

const getTurbineMapData = async () => {
  return await axios.get("http://127.0.0.1:8000/ant-colony/get-turbines-map");
};

const getSubsystemData = async () => {
  return await axios.get("http://127.0.0.1:8000/ant-colony/get-subsystems");
};

const runRouteOptimizer = async (data, algorithm) => {
  return await axios.post(
    `http://127.0.0.1:8000/ant-colony/run-route-optimizer/`,
    data=data,
    {
      params: {
        algorithm: algorithm, // Lista de valores ["genetic", "memetic"]
      }
    }
  );
};

export { getTurbineMapData, getSubsystemData, runRouteOptimizer };
