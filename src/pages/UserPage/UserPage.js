import styled from "styled-components";
import Header from "../../components/Header";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/auth.context";
import TrendingList from "../../components/TrendingList";
import { useParams } from "react-router-dom";
import { Post } from "../../components/Post.js";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import Search from "../../components/Search";
import FollowButton from "../../components/FollowButton";

export default function UserPage() {
    const { auth } = useContext(AuthContext);
    const [disable, setDisable] = useState(false);
    const [reload, setReload] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [follows, setFollows] = useState();
    const params = useParams();

    useEffect(() => {
        setLoading(true);
        if (auth) {
            setPosts([]);
            axios.get(`${process.env.REACT_APP_API_URL}/getFollow/${params.id}`, { headers: { Authorization: `Bearer ${auth?.token}` } })
                .then((res) => {
                    if (res.data === "yourself") setFollows("yourself");
                    else if (res.data.length > 0) setFollows("Inserted");
                    else if (res.data.length <= 0) setFollows("Deleted");
                    axios.get(`${process.env.REACT_APP_API_URL}/user/${params.id}`, { headers: { Authorization: `Bearer ${auth?.token}` } })
                        .then(resp => {
                            setPosts(resp.data);
                            setLoading(false);
                        })
                        .catch(resp => {
                            console.error(resp.response);
                            setLoading(false);
                            setError(resp.response);
                        });
                })
                .catch((err) => {
                    alert("Error! Was not possible accomplish the operations");
                })
        } else setLoading(false);
        setReload(false);
    }, [reload, params]);

    function showTimeline() {
        if (loading && !posts.length) {
            return (
                <span data-test="message" >Loading</span>
            )
        } else if (Object.keys(error).length !== 0) {
            if (error.status === 404) {
                alert('user not found');
                return (
                    <span data-test="message" >user not found</span>
                )
            } else {
                alert('An error occured while trying to fetch the posts, please refresh the page');
                return (
                    <span data-test="message" >An error occured while trying to fetch the posts, please refresh the page</span>
                )
            }
        } else if (posts.length === 0 || posts[0].noPosts === true) {
            return (
                <span data-test="message" >There are no posts yet</span>
            )
        } else {
            return (
                <>
                    {posts.map(e => <Post key={e.id+e.repostUserName} postInfo={e} myUsername={auth?.username} 
                    setReload={setReload} disable={disable} posts={posts} setPosts={setPosts} />)}
                </>
            )
        }
    }

    const render = useMediaQuery({ maxWidth: 425 });

    return (
        <>
            <Header />
            {render && <Search />}
            <TimeLineContainer>
                <Container>
                    <PageTitle>

                        {posts.length ?
                            <>
                                <img src={posts[0].pageUserInfo?.picture || posts[0]?.picture } alt="user" />
                                <h1>{posts[0].pageUserInfo?.userName || posts[0]?.userName }</h1>
                                <FollowButton follows={follows} setFollows={setFollows} />
                            </> : error.status === 404 ?
                                <h1>User NOT Found</h1> :
                                <>
                                <h1>Loading...</h1>
                                <FollowButton/> 
                                </>}
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
    @media (max-width: 425px) {
        gap: 15px;
        margin-left: 34px;
    img{
        width: 45px;
        height: 45px;
    }
    h1{
        font-size: 33px;
    }
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
    @media (max-width: 425px) {
    width: 100%;
    max-width: 425px;
  }
`

const Wrapper = styled.div`
    display: flex;
    gap: 41px;
    margin-top: 30px;
    @media (max-width: 425px){
        margin-top: 20px;
    }
`
const Container = styled.div`
    margin-top: 53px;
    @media (max-width: 425px){
        margin-top: 20px;
    }
`
