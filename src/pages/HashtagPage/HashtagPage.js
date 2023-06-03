import styled from "styled-components";
import Header from "../../components/Header";
import TrendingList from "../../components/TrendingList";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth.context";
import tagsServices from "../../services/tagsServices";
import { ThreeDots } from "react-loader-spinner";
import HashtagDescription from "../../components/HashtagDescription";

export default function HashtagPage() {
  const { auth } = useContext(AuthContext);
  const { hashtag } = useParams();
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    if (auth) {
      setPostList([]);
      tagsServices
        .getTagPostList(auth.token, hashtag)
        .then(({ data }) => {
          setPostList(data);
        })
        .catch((err) => {
          alert(`Error ${err.response.status}: ${err.response.data}`);
        });
    }
  }, [hashtag]);

  return (
    <>
      <Header />
      <PageStyle>
        <Wrapper>
          <h2 data-test="hashtag-title"># {hashtag}</h2>
          <ContentContainer>
            <Listing>
              {!postList.length && (
                <LoadingStyle>
                  Loading
                  <ThreeDots height={6} width={18} color="white" />
                </LoadingStyle>
              )}
              {postList.map((p) => (
                <li key={p.id} data-test="post">
                  <ItemNav>
                    <img
                      src={p.picture}
                      alt="user-pic"
                      onError={(e) =>
                        (e.target.src = `https://cdn.hugocalixto.com.br/wp-content/uploads/sites/22/2020/07/error-404-1.png`)
                      }
                    />
                    <LikeInfo>
                      {p.hasLiked ? (
                        <AiFillHeart
                          color={"red"}
                          size={20}
                          data-test="like-btn"
                        />
                      ) : (
                        <AiOutlineHeart
                          color={"white"}
                          size={20}
                          data-test="like-btn"
                        />
                      )}
                      <p data-test="counter">{p.qtt_likes} likes</p>
                    </LikeInfo>
                  </ItemNav>
                  <PostInfo>
                    <h6 data-test="username">{p.userName}</h6>
                    <HashtagDescription description={p.description} />
                    <Link to={p.link} target="_blank" data-test="link">
                      <MetaDataContainer>
                        <div>
                          <h4>
                            {p.linkMetadata?.myTitle ||
                              "Não foi possivel obter informações do link"}
                          </h4>
                          <p>{p.linkMetadata?.description || ""}</p>
                          <span>{p.link}</span>
                        </div>
                        <section>
                          <img
                            src={
                              !p.linkMetadata
                                ? "https://thumbs.dreamstime.com/b/website-under-construction-internet-error-page-not-found-webpage-maintenance-error-page-not-found-message-technical-website-under-143040659.jpg"
                                : p.linkMetadata.image
                                ? `${p.link}${p.linkMetadata?.image}`
                                : p.linkMetadata["og:image"] ||
                                  p.linkMetadata.myFavIcon
                            }
                            alt="link-display"
                            onError={(e) =>
                              (e.target.src = `https://cdn.hugocalixto.com.br/wp-content/uploads/sites/22/2020/07/error-404-1.png`)
                            }
                          />
                        </section>
                      </MetaDataContainer>
                    </Link>
                  </PostInfo>
                </li>
              ))}
            </Listing>
            <TrendingList />
          </ContentContainer>
        </Wrapper>
      </PageStyle>
    </>
  );
}

const PageStyle = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding-bottom: 80px;
  a {
    text-decoration: none;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 25px;
`;

const Listing = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  li {
    width: 611px;
    min-height: 276px;
    height: 276px;
    max-height: 276px;
    background: #171717;
    border-radius: 16px;
    display: flex;
    gap: 19px;
    padding: 18px;
    font-family: "Lato", sans-serif;
    font-style: normal;
    font-weight: 400;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 41px;
  h2 {
    font-family: "Oswald", sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 43px;
    line-height: 64px;
    margin-top: 53px;
    color: #ffffff;
    width: 100%;
  }
`;

const LikeInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 4px;
  width: 100%;
  p {
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    text-align: center;
    color: #ffffff;
  }
`;

const ItemNav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 19px;
  img {
    min-width: 50px;
    width: 50px;
    min-height: 50px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
  }
  svg {
    cursor: pointer;
  }
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 7px;
  width: 100%;
  h6 {
    font-size: 19px;
    line-height: 23px;
    color: #ffffff;
  }
  p {
    font-size: 17px;
    line-height: 20px;
    font-weight: 400;
    color: #b7b7b7;
    a {
      font-weight: 700;
      color: white;
    }
  }
`;

const MetaDataContainer = styled.div`
  border: 1px solid #4d4d4d;
  border-radius: 11px;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  height: 155px;
  div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px 27px 23px 19px;
    h4 {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      color: #cecece;
      min-height: 19px;
      max-height: 38px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    p {
      margin-top: 5px;
      font-style: normal;
      font-weight: 400;
      font-size: 11px;
      line-height: 13px;
      color: #9b9595;
      min-height: 13px;
      max-height: 52px;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    span {
      font-style: normal;
      font-weight: 400;
      font-size: 11px;
      line-height: 13px;
      color: #cecece;
    }
  }
  section {
    position: relative;
    min-width: 153px;
    width: 153px;
    height: 153px;
    img {
      position: absolute;
      bottom: 49.7%;
      right: 49.2%;
      transform: translate(50%, 50%);
      min-width: 156px;
      width: 156px;
      height: 156px;
      object-fit: cover;
      border-radius: 0px 12px 13px 0px;
    }
  }
`;

const LoadingStyle = styled.div`
  display: flex;
  gap: 2px;
  width: 611px;
  justify-content: center;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 19px;
  line-height: 23px;
  letter-spacing: 0.05em;
  div {
    margin-bottom: 1px;
  }
  svg {
    align-self: end;
    justify-self: end;
  }
`;
