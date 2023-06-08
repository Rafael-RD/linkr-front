import axios from "axios";

const url = `${process.env.REACT_APP_API_URL}/post`;

function generateHeader(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function createNewComment(token, postId, body) {
  return axios.post(
    `${url}/comments/new/${postId}`,
    body,
    generateHeader(token)
  );
}

function listComments(token, postId) {
  return axios.get(`${url}/comments/list/${postId}`, generateHeader(token));
}

function getNewPostsCounter(token, lastCreatedAt) {
  return axios.get(
    `${url}/list/counter/${lastCreatedAt}`,
    generateHeader(token)
  );
}

function getNewPostsUpdate(token, lastCreatedAt) {
  return axios.get(
    `${url}/list/update/${lastCreatedAt}`,
    generateHeader(token)
  );
}

const postsServices = {
  createNewComment,
  listComments,
  getNewPostsCounter,
  getNewPostsUpdate,
};

export default postsServices;
