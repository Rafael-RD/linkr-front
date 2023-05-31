import axios from "axios";

const url = `${process.env.REACT_APP_API_URL}/tags`;

function generateHeader(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function trendingList(token) {
  return axios.get(`${url}/trending`, generateHeader(token));
}

const tagsServices = { trendingList };

export default tagsServices;
