import axios from "axios";

const url = `${process.env.REACT_APP_API_URL}`;

function signup(body) {
  return axios.post(`${url}/signup`, body);
}

function signin(body) {
  return axios.post(`${url}/signin`, body);
}

const authServices = { signup, signin };

export default authServices;
