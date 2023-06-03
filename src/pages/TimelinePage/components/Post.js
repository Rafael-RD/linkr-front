import styled from "styled-components";
import { AiFillHeart, AiOutlineHeart, AiFillDelete } from "react-icons/ai";
import { TiPencil } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../../context/auth.context";
import axios from "axios";

export function Post({ postInfo, myUsername, setReload, disable}) {
    const { auth } = useContext(AuthContext);

    /* eslint-disable */
    const {
        id,
        description,
        link,
        createdAt,
        userName,
        picture,
        qtt_likes,
        like_users,
        tag_array,
        linkMetadata
    } = postInfo;
    /* eslint-enable */
    const [likeCount, setLikeCount] = useState(qtt_likes)
    const [likeUsers, setLikeUsers] = useState(like_users)

    function like(){
       
        const post = String(postInfo.id)
        const config = {
            headers: { Authorization: `Bearer ${auth.token}` }
        }
        if(disable) return
        disable = true
        axios.post(`${process.env.REACT_APP_API_URL}/likes/${post}`, {}, config)
                .then((res) => {
                    disable=false
                    let like_users_copy = []
                    if(like_users){
                        like_users_copy = [...like_users]
                    }
                    if(res.data[0]?.user_liked && !like_users_copy.includes(myUsername)){
                        like_users_copy.push(myUsername)
                    } 
                    if(!res.data[0]?.user_liked && like_users_copy.includes(myUsername)){
                        like_users_copy = like_users_copy.filter(e => e !== myUsername)
                    }
                    setLikeCount(res.data[0]?.qtt_likes || 0)
                    setLikeUsers(like_users_copy)
                })
                .catch((err) => {
                    alert(err.message)
                    disable=false
                })
    }
    function liked() {
        if (likeUsers?.includes(myUsername)) {
            return (
                <AiFillHeart color="red" onClick={!disable?( like ) : null} />
            )
        } else {
            return (
                <AiOutlineHeart disabled={disable} onClick={!disable?(like) : null} />
            )
        }
    }

    function showLikes() {
        if (!likeCount) return "0";
        else if (likeCount < 1000) return likeCount;
        else if (likeCount < 1000 * 1000) return Math.floor(likeCount / 1000) + " K";
        else return Math.floor(likeCount / (1000 * 1000)) + " M";
    }

    return (
        <PostContainer>
            <ImgLike>
                <img src={picture} alt="profile" />
                {liked()}
                <span>{showLikes()} likes</span>
            </ImgLike>
            <ContentContainer>
                <NameConfigPost>
                    <span>{userName}</span>
                    <PostConfig hide={myUsername === userName}>
                        <TiPencil />
                        <AiFillDelete />
                    </PostConfig>
                </NameConfigPost>
                <p>{description}</p>
                <Link to={link} target="_blank" data-test="link">
                    <CardMetadata>
                        <div>
                            <h2>{linkMetadata?.myTitle || "Não foi possivel obter informações do link"}</h2>
                            <p>{linkMetadata?.description || ""}</p>
                            <span>{link}</span>
                        </div>
                        <img src={!linkMetadata ?
                            "https://thumbs.dreamstime.com/b/website-under-construction-internet-error-page-not-found-webpage-maintenance-error-page-not-found-message-technical-website-under-143040659.jpg" :
                            linkMetadata.image ?
                                `${link}${linkMetadata?.image}` :
                                linkMetadata["og:image"] || linkMetadata.myFavIcon}
                            onError={(e) => (e.target.src = `https://cdn.hugocalixto.com.br/wp-content/uploads/sites/22/2020/07/error-404-1.png`)}
                            alt="link" />
                    </CardMetadata>
                </Link>
            </ContentContainer>
        </PostContainer>
    )
}

const PostContainer = styled.div`
    width: 100%;
    height: fit-content;
    display: flex;
    background: #171717;
    border-radius: 16px;
    padding: 20px;
    gap: 20px;

    span, p, svg{
        color: white;
    }
`;

const ImgLike = styled.div`
    width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    img{
        width: 50px;
        height: 50px;
        border-radius: 100%;
    }
    svg{
        width: 35px;
        height: 35px;
    }
    span{
        font-family: 'Lato', sans-serif;
        font-weight: 400;
        font-size: 14px;
        text-align: center;
        word-wrap: break-word;
    }
`;

const ContentContainer = styled.div`
    width: calc(100% - 80px);
    display: flex;
    flex-direction: column;
    gap: 15px;

    p{
        width: 100%;
        font-family: 'Lato', sans-serif;
        font-weight: 400;
        font-size: 20px;
        color: #B7B7B7;
        word-wrap: break-word;
    }

    span{
        font-family: 'Lato', sans-serif;
        font-weight: 700;
        font-size: 20px;
        color: #FFFFFF;
    }

    a{
        text-decoration: none;
    }
`;

const NameConfigPost = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    span{
        font-family: 'Lato', sans-serif;
        font-weight: 400;
        font-size: 20px;
    }
`;

const PostConfig = styled.div`
    display: ${(prop) => prop.hide ? 'flex' : 'none'};
    gap: 10px;
    svg{
        width: 18px;
        height: 18px;
    }
`;

const CardMetadata = styled.div`
    display: flex;
    border: solid 1px #4D4D4D;
    border-radius: 11px;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    cursor: pointer;

    div{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: fit-content;
        padding: 20px;
        gap: 10px;

        h2{
            font-family: 'Lato', sans-serif;
            font-size: 16px;
            color: #cecece;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            line-height: 1;
            max-height: 1 * 3;
        }
        p{
            font-family: 'Lato', sans-serif;
            font-size: 11px;
            color: #9B9595;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            line-height: 1;
            max-height: 1 * 4;
        }
        span{
            font-family: 'Lato', sans-serif;
            font-size: 11px;
            color: #cecece;
        }
    }

    img{
        height: 100%;
        width: 155px;
        object-fit: cover;
    }
`;