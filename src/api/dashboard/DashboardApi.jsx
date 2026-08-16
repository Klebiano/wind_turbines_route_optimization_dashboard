import apiClient from "../config";

const getTurbineMapData = async () => {
  return await apiClient.get("/ant-colony/get-turbines-map");
};

const getSubsystemData = async () => {
  return await apiClient.get("/ant-colony/get-subsystems");
};

const runRouteOptimizer = async (data, algorithm) => {
  return await apiClient.post(
    "/ant-colony/run-route-optimizer",
    data,
    {
      params: {
        algorithm: algorithm, // Lista de valores ["Genetic", "Memetic", "Ant Colony"]
      }
    }
  );
};

export { getTurbineMapData, getSubsystemData, runRouteOptimizer };
