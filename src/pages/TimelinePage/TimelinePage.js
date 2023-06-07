import styled from "styled-components";
import Header from "../../components/Header"
import { useState } from "react";
import { Timeline } from "./components/Timeline.js";
import TrendingList from "../../components/TrendingList";
import { useMediaQuery } from "react-responsive";
import Search from "../../components/Search";
import { PublishPost } from "./components/PublishPost";

export default function TimelinePage() {
    const [reload, setReload] = useState(false);
    const [posts, setPosts] = useState([]);
    const render = useMediaQuery({ maxWidth: 425 });

    return(
        <>
        <Header/>
        { render && <Search />}
        <TimeLineContainer>
            <Container>
                <h1>timeline</h1>
            <Wrapper>
            <ContentContainer>
                <PublishPost reload={reload} setReload={setReload} posts={posts} setPosts={setPosts}/>
                <Timeline reload={reload} setReload={setReload} posts={posts} setPosts={setPosts}/>
            </ContentContainer>
            <TrendingList/>
            </Wrapper>
            </Container>
        </TimeLineContainer>
        </>
    )
}

const TimeLineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding-bottom: 80px;
        h1{
        font-family: 'Oswald', sans-serif;
        color: white;
        font-weight: 700;
        font-size: 43px;
        width: 100%;
        margin-bottom: 43px;
        line-height: 64px;
    }
    @media (max-width: 425px) {
    h1{
        width: auto;
        margin-left: 17px;
        margin-bottom: 10px;
        font-size: 33px;
        line-height: 49px;
    }
  }
   
`

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 611px;
    height: 100%;
    h1{
        font-family: 'Oswald', sans-serif;
        color: white;
        font-weight: 700;
        font-size: 43px;
        width: 100%;
    }
    @media (max-width: 425px) {
    width: 100%;
    max-width: 425px;
  }
`
const Wrapper =styled.div`
  display: flex;
  gap: 41px;
`
const Container = styled.div`
    margin-top: 53px;
    @media (max-width: 425px){
        margin-top: 20px;
    }
`
