import styled from "styled-components";
import Header from "../../components/Header";
import TrendingList from "../../components/TrendingList";
import { AiOutlineHeart } from "react-icons/ai";

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
                <div>
                  <img src="https://m.media-amazon.com/images/I/511A7gqNwgL._AC_UF894,1000_QL80_.jpg" />
                  <LikeInfo>
                    <AiOutlineHeart />
                    13 likes
                  </LikeInfo>
                </div>
                <div>
                  <h6>Juvenal Juvêncio</h6>
                </div>
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
  background: red;
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
  li {
    width: 611px;
    height: 276px;
    background: #171717;
    border-radius: 16px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }
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
`;
