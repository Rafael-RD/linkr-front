import axios from "axios";

const url = `${process.env.REACT_APP_API_URL}`;

function signup(body) {
  return axios.post(`${url}/signup`, body);
}

const authServices = { signup };

export default authServices;
