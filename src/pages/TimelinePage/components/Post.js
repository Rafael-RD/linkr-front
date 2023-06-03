import styled from "styled-components";
import { AiFillHeart, AiOutlineHeart, AiFillDelete } from "react-icons/ai";
import { TiPencil } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useRef } from "react";
import AuthContext from "../../../context/auth.context.js";
import axios from "axios";
import Modal from 'react-modal';
import { Tooltip } from "react-tooltip";
import { useContext, useState } from "react";
import HashtagDescription from "../../../components/HashtagDescription.js";

export function Post({ postInfo, myUsername, setReload, disable }) {
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
    const focusEdit = useRef();
    const [editOn, setEditOn] = useState(false);
    const [descriptionEdit, setDescriptionEdit] = useState(description);
    const [lastDescription, setLastDescription] = useState(description);
    const [modalIsOpen, setIsOpen] = useState(false);
    const { auth } = useContext(AuthContext);
    let subtitle;
    const [likeCount, setLikeCount] = useState(qtt_likes)
    const [likeUsers, setLikeUsers] = useState(like_users)

    function like() {

        const post = String(postInfo.id)
        const config = {
            headers: { Authorization: `Bearer ${auth.token}` }
        }
        if (disable) return
        disable = true
        axios.post(`${process.env.REACT_APP_API_URL}/likes/${post}`, {}, config)
            .then((res) => {
                disable = false
                let like_users_copy = []
                if (like_users) {
                    like_users_copy = [...like_users]
                }
                if (res.data[0]?.user_liked && !like_users_copy.includes(myUsername)) {
                    like_users_copy.push(myUsername)
                }
                if (!res.data[0]?.user_liked && like_users_copy.includes(myUsername)) {
                    like_users_copy = like_users_copy.filter(e => e !== myUsername)
                }
                setLikeCount(res.data[0]?.qtt_likes || 0)
                setLikeUsers(like_users_copy)
            })
            .catch((err) => {
                alert(err.message)
                disable = false
            })
    }
    function liked() {
        if (likeUsers?.includes(myUsername)) {
            return (
                <AiFillHeart data-test="like-btn" color="red" onClick={!disable ? (like) : null} />
            )
        } else {
            return (
                <AiOutlineHeart data-test="like-btn" disabled={disable} onClick={!disable ? (like) : null} />
            )
        }
    }

    function showLikes(likes) {
        if (!likes) return "0";
        else if (likes < 1000) return likes;
        else if (likes < 1000 * 1000) return Math.floor(likes / 1000) + " K";
        else return Math.floor(likes / (1000 * 1000)) + " M";
    }

    function tooltipContent() {
        if (!likeCount) return null;
        const userLiked = likeUsers?.includes(myUsername);
        const otherLikes = [...likeUsers];
        otherLikes?.splice(likeUsers.indexOf(myUsername), 1);
        switch (likeCount) {
            case '1':
                if (userLiked) return 'You';
                else return likeUsers[0];

            case '2':
                if (userLiked) return `You and ${otherLikes[0]}`;
                else return `${likeUsers[0]} and ${likeUsers[1]}`;

            case '3':
                if (userLiked) return `You, ${otherLikes[0]} and 1 other`;
                else return `${likeUsers[0]}, ${likeUsers[1]} and 1 other`;

            default:
                if (userLiked) return `You, ${otherLikes[0]} and ${showLikes(likeCount - 2)} others`;
                else return `${likeUsers[0]}, ${likeUsers[1]} and ${showLikes(likeCount - 2)} others`;
        }
    }

    async function editPost() {
        if (!editOn) {
            setEditOn(true);
        } else {
            setEditOn(false);
            setDescriptionEdit(lastDescription);
        }
    }

    function handleChange(e) {
        setDescriptionEdit(e.target.value);
    }

    async function handleKeyPress(event) {
        if (event.key === 'Enter') {
            setEditOn(false);
            pacthPostEdit()
        }
    }


    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function pacthPostEdit() {
        const config = {
            headers: { Authorization: `Bearer ${auth.token}` }
        }

        const objeto = {
            description: descriptionEdit,
            postId: id
        }
        axios.patch(`${process.env.REACT_APP_API_URL}/post`, objeto, config)
            .then((res) => {
                setLastDescription(descriptionEdit);
            })
            .catch((err) => {
                alert("Houve um erro ao editar seu post")
                console.log(err.message)
            })
    }


    function deletePost() {
        const config = {
            headers: { Authorization: `Bearer ${auth.token}` }
        }
        axios.delete(`${process.env.REACT_APP_API_URL}/post/${id}`, config)
            .then((res) => {
                setReload(true);
            })
            .catch((err) => {
                alert("Houve um erro ao deletar seu post")
                console.log(err.message)
            })
    }


    return (
        <PostContainer>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <h2 >Are you sure you want to delete this post?</h2>
                <div>
                    <button className="back" onClick={closeModal}>No, go back</button>
                    <button className="delete" onClick={() => { closeModal(); deletePost(); }}>Yes, delete it</button>
                </div>
            </Modal>
            <ImgLike>
                <img src={picture} alt="profile" 
                onError={(e) => (e.target.src = `https://cdn.hugocalixto.com.br/wp-content/uploads/sites/22/2020/07/error-404-1.png`)} />
                {liked()}
                <span data-test="counter" data-tooltip-id="likes-tooltip" data-tooltip-content={tooltipContent()} data-tooltip-place="bottom" >{showLikes(likeCount)} likes</span>
                <Tooltip data-test="tooltip" id="likes-tooltip"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        opacity: "1",
                        color: "#282829",
                        borderRadius: "17px",
                    }} />
            </ImgLike>
            <ContentContainer edit={editOn}>
                <NameConfigPost>
                    <span data-test="username" >{userName}</span>
                    <PostConfig hide={myUsername === userName}>
                        <TiPencil data-test="edit-btn" onClick={editPost} />
                        <AiFillDelete data-test="delete-btn" onClick={openModal} />
                    </PostConfig>
                </NameConfigPost>
                {
                    editOn ?
                    <textarea ref={focusEdit} type="text" placeholder={descriptionEdit} value={descriptionEdit} disabled={!editOn} onChange={handleChange} onKeyPress={handleKeyPress} /> :
                    <HashtagDescription description={descriptionEdit} />
                }
                <Link data-test="link" to={link} target="_blank" >
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

const customStyles = {
    content: {
        position: "absolute",
        top: 'calc(50% - 131px)',
        left: 'calc(50% - 298px)',
        right: 'auto',
        bottom: 'auto',
        width: "597px",
        height: "262px",
        background: "#333333",
        borderRadius: "50px",
    },
};

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
        object-fit: cover;
    }
    svg{
        width: 35px;
        height: 35px;
        cursor: pointer;
    }
    span{
        font-family: 'Lato', sans-serif;
        font-weight: 400;
        font-size: 14px;
        text-align: center;
        word-wrap: break-word;
    }
    > div{
        font-family: 'Lato', sans-serif;
        font-weight: 700;
        font-size: 13px;
    }
`;

const ContentContainer = styled.div`
    width: calc(100% - 80px);
    display: flex;
    flex-direction: column;
    gap: 15px;

    textarea{
        width: 100%;
        font-family: 'Lato', sans-serif;
        font-weight: 400;
        font-size: 20px;
        color: #B7B7B7;
        background-color: #FFFFFF;
        border-radius: 7px;
        border: none;
        word-wrap: break-word;
        resize: none;
        overflow: auto;
    }

    span{
        font-family: 'Lato', sans-serif;
        font-weight: 700;
        font-size: 20px;
        color: #FFFFFF;
    }

    a{
        text-decoration: none;
        color: #FFFFFF;
        font-family: 'Lato', sans-serif;
        font-weight: 700;
        font-size: 20px;
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