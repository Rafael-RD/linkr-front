import { useContext, useEffect, useState } from "react";
import styled from "styled-components"
import AuthContext from "../../../context/auth.context.js";
import axios from "axios";
import { Post } from "../../../components/Post.js";
import InfiniteScroll from "react-infinite-scroller";
import Loading from "../../../components/Loading.js";

export function Timeline({ reload, setReload, posts, setPosts, setLoaded }) {
    const { auth } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [ifFollow, setIfFollow] = useState(false);
    const [endTimeline, setEndTimeline] = useState(false);
    let disable = false

    useEffect(() => {
        setLoading(true);
        setLoaded(false);
        if (auth) {
            axios.get(`${process.env.REACT_APP_API_URL}/ifFollow`, { headers: { Authorization: `Bearer ${auth?.token}` } })
                .then(res => {
                    if (res.data) setIfFollow(true)
                    axios.get(`${process.env.REACT_APP_API_URL}/timeline`, { headers: { Authorization: `Bearer ${auth?.token}` } })
                        .then(resp => {
                            setPosts(resp.data);
                            setLoading(false);
                            setLoaded(true)
                        })
                        .catch(resp => {
                            console.error(resp);
                            setLoading(false);
                            setError(true);
                        });
                })
                .catch(resp => {
                    console.error(resp);
                    setError(true);
                });
        } else setLoading(false);
        setReload(false)
    }, [reload]);

    function fetchPosts() {
        setLoading(true);
        setLoaded(false);
        if (auth) {
            axios.get(`${process.env.REACT_APP_API_URL}/timeline?createdAt=${posts[posts.length - 1].createdAt.toString()}`, { headers: { Authorization: `Bearer ${auth?.token}` } })
                .then(resp => {
                    if (resp.data.length < 10) setEndTimeline(true);
                    setPosts([...posts, ...resp.data]);
                    setLoading(false);
                    setLoaded(true);
                })
                .catch(resp => {
                    console.error(resp);
                    setLoading(false);
                    setError(true);
                });
        } else setLoading(false);
    }

    function showTimeline() {

        if (error) {
            alert('An error occured while trying to fetch the posts, please refresh the page');
            return (
                <span data-test="message" >An error occured while trying to fetch the posts, please refresh the page</span>
            )
        } else if (loading && !posts.length) {
            return (
                <Loading key={0} />
            )
        } else if (posts.length === 0 && ifFollow) {
            return (
                <span data-test="message" >No posts found from your friends</span>
            )
        } else if (posts.length === 0 && !ifFollow) {
            return (
                <span data-test="message" >You don't follow anyone yet. Search for new friends!</span>
            )
        } else {
            return (
                <>
                    {posts.map(e => <Post key={e.id + e.repostUserName} postInfo={e} myUsername={auth?.username}
                        setReload={setReload} disable={disable} />)}
                </>
            )
        }
    }

    return (
        <TimelineContainer>
            <InfiniteScroll
                pageStart={0}
                loadMore={fetchPosts}
                hasMore={posts.length !== 0 && endTimeline === false}
                loader={<Loading key={0} />}
                threshold={0}
            >
                {showTimeline()}
            </InfiniteScroll>
        </TimelineContainer>
    )
}

const TimelineContainer = styled.div`
    >div{
        overflow: auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        margin-top: 30px;
        overflow: hidden;
        @media (max-width: 425px) {
            width: 100vw;
        }
    }
`;
