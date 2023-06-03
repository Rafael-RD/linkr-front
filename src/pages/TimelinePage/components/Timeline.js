import { useContext, useEffect, useState } from "react";
import styled from "styled-components"
import AuthContext from "../../../context/auth.context.js";
import axios from "axios";
import { Post } from "./Post.js";

export function Timeline({reload, setReload}) {
    const { auth } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [posts, setPosts] = useState([]);
    // const [disable, setDisable] = useState(false)
    let disable=false
    useEffect(() => {
        setLoading(true);
        if (auth) {
            axios.get(`${process.env.REACT_APP_API_URL}/timeline`, { headers: { Authorization: `Bearer ${auth?.token}` } })
                .then(resp => {
                    console.log(resp.data);
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
    }, [reload]);

    function showTimeline() {
        if (loading) {
            return (
                <span>Loading</span>
            )
        } else if (error) {
            return (
                <span>An error occured while trying to fetch the posts, please refresh the page</span>
            )
        } else if (posts.length === 0) {
            return (
                <span>There are no posts yet</span>
            )
        } else {
            return (
                <>
                    {posts.map(e=><Post key={e.id} postInfo={e} myUsername={auth?.username} 
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
`;
