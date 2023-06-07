import styled from "styled-components";
import { GrUpdate } from "react-icons/gr";
import useInterval from "use-interval";
import postsServices from "../../../services/postsServices";
import { useContext } from "react";
import AuthContext from "../../../context/auth.context";
import { useState } from "react";

export default function PostListUpdater({ posts, setPosts }) {
  const { auth } = useContext(AuthContext);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  let intervalTimer = 15000;
  let lastCreatedAt = posts[0]?.createdAt || null;

  useInterval(() => {
    postsServices
      .getNewPostsCounter(auth.token, lastCreatedAt)
      .then((res) => {
        setCounter(Number(res.data.new_post_counts) - 1);
      })
      .catch((err) => console.log(err));
  }, intervalTimer);

  function handleClick() {
    setLoading(true);
    postsServices
      .getNewPostsUpdate(auth.token, lastCreatedAt)
      .then((res) => {
        setLoading(false);
        setPosts([...res.data, ...posts]);
        setCounter(0);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }

  return (
    <>
      {counter > 0 && (
        <UpdaterBtn onClick={handleClick} disabled={loading}>
          <span>{counter} new posts, load more!</span>
          <GrUpdate color="white" fill="white" size={16} />
        </UpdaterBtn>
      )}
    </>
  );
}

const UpdaterBtn = styled.button`
  cursor: pointer;
  background: #1877f2;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  border: none;
  padding: 21px;
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  svg {
    width: 22px;
    height: 16px;
  }
  svg path {
    stroke: white;
  }
`;
