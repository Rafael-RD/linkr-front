import styled from "styled-components";
import { useParams } from "react-router-dom";
import AuthContext from "../context/auth.context";
import { useContext } from "react";
import axios from "axios";
import { useState } from "react";

export default function FollowButton({follows, setFollows}) {
    const { auth } = useContext(AuthContext);
    const params = useParams();
    const [disable, setDisable] = useState(false);

    function follow(){
        setDisable(true)
        const body = { followedId: params.id }
        const config = {
            headers: { Authorization: `Bearer ${auth.token}` }
        }
        axios.post(`${process.env.REACT_APP_API_URL}/follow`, body, config)
            .then((res) => {
                setFollows(res.data)
                setDisable(false)
            })
            .catch((err) => {
                alert(err.message)
                setDisable(false)
            })
    }

    return(
        <>
       {   follows === "yourself" ? <></> :       
            <FollowButtons
             color={!(follows === "Inserted")}
             data-test="follow-btn" disabled={disable} onClick={follow}>
                {follows === "Inserted" ? "Unfollow" : "Follow"} 
            </FollowButtons>    
        }
        
        </>
        
    )
}

const FollowButtons = styled.button`
    width: 112px;
    height: 31px;
    border-radius: 5px;
    background-color: ${(prop) => prop.color? '#1877F2' : 'white'};
    font-family: 'Lato', sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 17px;
    color: ${(prop) => prop.color? 'white' : '#1877F2'};
    border: none;
    cursor: pointer;
`