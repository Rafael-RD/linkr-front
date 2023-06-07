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

function getTagPostList(token, name) {
  return axios.get(`${url}/hashtag/${name}`, generateHeader(token));
}

const tagsServices = { trendingList, getTagPostList };

export default tagsServices;
