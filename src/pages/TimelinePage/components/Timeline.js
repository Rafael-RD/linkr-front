import { useContext, useEffect, useState } from "react";
import styled from "styled-components"
import AuthContext from "../../../context/auth.context.js";
import axios from "axios";
import { Post } from "../../../components/Post.js";

export function Timeline({reload, setReload, posts, setPosts}) {
    const { auth } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [ifFollow, setIfFollow] = useState(false)
    let disable=false
    useEffect(() => {
        setLoading(true);
        if (auth) {
            axios.get(`${process.env.REACT_APP_API_URL}/ifFollow`, { headers: { Authorization: `Bearer ${auth?.token}` } })
                .then(res => {
                    // console.log(res.data)////////////////////////////////////////////////////////////
                    if(res.data) setIfFollow(true)
                    axios.get(`${process.env.REACT_APP_API_URL}/timeline`, { headers: { Authorization: `Bearer ${auth?.token}` } })
                    .then(resp => {
                        setPosts(resp.data);
                        setLoading(false);
                    })
                    .catch(resp => {
                        console.error(resp);
                        setLoading(false);
                        setError(true);
                    });
                })
                .catch(resp => {
                    console.error(resp);
                });
        } else setLoading(false);
        setReload(false)
    }, [reload]);

    function showTimeline() {
        // {console.log("if",ifFollow)}/////////////////////////////////////////////////////////////////
        if (loading && !posts.length) {
            return (
                <span data-test="message" >Loading</span>
            )
        } else if (error) {
            alert('An error occured while trying to fetch the posts, please refresh the page');
            return (
                <span data-test="message" >An error occured while trying to fetch the posts, please refresh the page</span>
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
                    {posts.map((e,i)=><Post key={i} postInfo={e} myUsername={auth?.username} 
                    setReload={setReload} disable={disable}/>)}
                </>
            )
        }
    }

    return (
        <TimelineContainer>
            {showTimeline()}
        </TimelineContainer>
    )
}

const TimelineContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
    @media (max-width: 425px) {
    width: 100vw;
  }
   
`;
