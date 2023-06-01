import styled from "styled-components";
import Header from "../../components/Header";
import TrendingList from "../../components/TrendingList";
import { AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function HashtagPage() {
  return (
    <>
      <Header />
      <PageStyle>
        <Wrapper>
          <h2># react</h2>
          <ContentContainer>
            <Listing>
              <li>
                <ItemNav>
                  <img src="https://m.media-amazon.com/images/I/511A7gqNwgL._AC_UF894,1000_QL80_.jpg" />
                  <LikeInfo>
                    <AiOutlineHeart />
                    <p>13 likes</p>
                  </LikeInfo>
                </ItemNav>
                <PostInfo>
                  <h6>Juvenal Juvêncio</h6>
                  <p>
                    Muito maneiro esse tutorial de Material UI com React, deem
                    uma olhada! #react #material
                  </p>
                  <MetaDataContainer>
                    <div>
                      <h4>Como aplicar o Material UI em um projeto React</h4>
                      <p>
                        Hey! I have moved this tutorial to my personal blog.
                        Same content, new location. Sorry about making you click
                        through to another page.
                      </p>
                      <Link>
                        https://medium.com/@pshrmn/a-simple-react-router
                      </Link>
                    </div>
                    <img src="" />
                  </MetaDataContainer>
                </PostInfo>
              </li>
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
    height: 276px;
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
    width: 50px;
    height: 50px;
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
  gap: 7px;
  h6 {
    font-size: 19px;
    line-height: 23px;
    color: #ffffff;
  }
  p {
    font-size: 17px;
    line-height: 20px;
    color: #b7b7b7;
  }
`;

const MetaDataContainer = styled.div`
  border: 1px solid #4d4d4d;
  border-radius: 11px;
  display: flex;
  margin-top: 8px;
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
    }
    p {
      font-style: normal;
      font-weight: 400;
      font-size: 11px;
      line-height: 13px;
      color: #9b9595;
    }
    a {
      font-style: normal;
      font-weight: 400;
      font-size: 11px;
      line-height: 13px;

      color: #cecece;
    }
  }
  img {
    min-width: 155px;
    height: 155px;
  }
`;
