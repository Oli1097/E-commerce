import axios from "axios";//for making HTTP requests from a web browser or Node.js.

const API_URL = "http://localhost:8000/";

axios.defaults.baseURL = API_URL;

export default axios;
