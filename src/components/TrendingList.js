import { useContext, useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AuthContext from "../context/auth.context";
import tagsServices from "../services/tagsServices";

export default function TrendingList() {
  const { auth } = useContext(AuthContext);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    tagsServices
      .trendingList(auth.token)
      .then(({ data }) => {
        console.log(data);
        setTags(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <TrendingListStyle>
      <h4>trending</h4>
      <ul>
        {!tags.length && (
          <LoadingStyle>
            Loading
            <ThreeDots height={6} width={18} color="white" />
          </LoadingStyle>
        )}

        {tags.map((t) => (
          <li key={t.name}>
            <Link to={`/hashtag/${t.name}`}># {t.name}</Link>
          </li>
        ))}
      </ul>
    </TrendingListStyle>
  );
}

const TrendingListStyle = styled.div`
  background: #171717;
  width: 301px;
  border-radius: 16px;
  position: sticky;
  height: 100%;
  top: calc(53px + 43px + 40px);
  h4 {
    padding: 9px 16px 12px;
    font-family: "Oswald", sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 27px;
    line-height: 40px;
    color: #ffffff;
  }
  ul {
    padding: 22px 16px 30px;
    border-top: 1px solid #484848;
    display: flex;
    flex-direction: column;
    gap: 3px;
    max-width: 100%;
    overflow: hidden;
    font-family: "Lato", sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 19px;
    line-height: 23px;
    letter-spacing: 0.05em;

    li {
      a {
        text-decoration: none;
        color: #ffffff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      max-width: 100%;

      display: flex;
    }
  }
`;

const LoadingStyle = styled.div`
  display: flex;
  gap: 2px;
  div {
    margin-bottom: 1px;
  }
  svg {
    align-self: end;
    justify-self: end;
  }
`;
