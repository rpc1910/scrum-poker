import axios from "axios";

function getBaseUrl() {
  if (process.env.REACT_APP_BASE_URL) {
    return process.env.REACT_APP_BASE_URL;
  }

  return "http://localhost:3333";
}

const api = axios.create({
  baseURL: getBaseUrl(),
});

export default api;
