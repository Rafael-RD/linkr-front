import styled from "styled-components";
import Header from "../../components/Header"
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/auth.context";
import TrendingList from "../../components/TrendingList";
import { useParams } from "react-router-dom";
import { Post } from "../../components/Post.js";
import axios from "axios";

export default function UserPage() {
    const { auth } = useContext(AuthContext);
    const [disable, setDisable] = useState(false);
    const [reload, setReload] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();

    useEffect(() => {
        setLoading(true);
        if (auth) {
            axios.get(`${process.env.REACT_APP_API_URL}/user/${params.id}`, { headers: { Authorization: `Bearer ${auth?.token}` } })
                .then(resp => {
                    setPosts(resp.data);
                    setLoading(false);
                })
                .catch(resp => {
                    console.error(resp);
                    setLoading(false);
                    setError(true);
                });
        } else setLoading(false);
        setReload(false)
    }, [reload, params]);

    function showTimeline() {
        if (loading && !posts.length) {
            return (
                <span data-test="message" >Loading</span>
            )
        } else if (error) {
            alert('An error occured while trying to fetch the posts, please refresh the page');
            return (
                <span data-test="message" >An error occured while trying to fetch the posts, please refresh the page</span>
            )
        } else if (posts.length === 0) {
            return (
                <span data-test="message" >There are no posts yet</span>
            )
        } else {
            return (
                <>
                    {posts.map(e => <Post key={e.id} postInfo={e} myUsername={auth?.username}
                        setReload={setReload} disable={disable} />)}
                </>
            )
        }
    }


    return (
        <>
            <Header />
            <TimeLineContainer>
                <Container>
                    <PageTitle>

                        {posts.length ?
                            <>
                                <img src={posts[0].picture} alt="user" />
                                <h1>{posts[0].userName}</h1>
                            </> :
                            <h1>Loading...</h1>}
                    </PageTitle>
                    <Wrapper>
                        <ContentContainer>
                            {showTimeline()}
                        </ContentContainer>
                        <TrendingList />
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
`;

const PageTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;
    margin-left: 35px;

    img{
        width: 50px;
        height: 50px;
        border-radius: 100%;
        object-fit: cover;
    }

    h1{
        font-family: 'Oswald', sans-serif;
        color: white;
        font-weight: 700;
        font-size: 43px;
        width: 100%;
    }
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 611px;
    height: 100%;
    align-items: center;
    gap: 20px;

    h1{
        font-family: 'Oswald', sans-serif;
        color: white;
        font-weight: 700;
        font-size: 43px;
        width: 100%;
    }
`

const Wrapper = styled.div`
  display: flex;
  gap: 41px;
  margin-top: 30px;
`
const Container = styled.div`
    margin-top: 53px;
`
