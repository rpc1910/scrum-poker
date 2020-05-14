import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3333",
  baseURL: "https://scrum-poker-rpc1910.herokuapp.com/",
});

export default api;
