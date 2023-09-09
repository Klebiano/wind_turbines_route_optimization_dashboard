import axios from "axios";

const getTurbineMapData = async () => {
  return await axios.get("http://127.0.0.1:8000/ant-colony/get-turbines-map");
};

const getSubsystemData = async () => {
  return await axios.get("http://127.0.0.1:8000/ant-colony/get-subsystems");
};

const runAntColonyAngorithm = async (data) => {
  return await axios.post(
    `http://127.0.0.1:8000/ant-colony/run-ant-colony-path/`,
    data
  );
};

export { getTurbineMapData, getSubsystemData, runAntColonyAngorithm };
