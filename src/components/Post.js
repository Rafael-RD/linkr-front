import styled from "styled-components";
import { AiFillHeart, AiOutlineHeart, AiFillDelete, AiOutlineComment } from "react-icons/ai";
import { FaRetweet } from "react-icons/fa";
import { TiPencil } from "react-icons/ti";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef } from "react";
import axios from "axios";
import Modal from 'react-modal';
import { Tooltip } from "react-tooltip";
import { useContext, useState } from "react";
import AuthContext from "../context/auth.context.js";
import HashtagDescription from "./HashtagDescription.js";
import { getMetadata } from "../utils/metadataRequest.js";
import Comment from "./Comment.js";

export function Post({ postInfo, myUsername, setReload, disable, posts, setPosts }) {
    /* eslint-disable */
    const {
        id,
        description,
        link,
        createdAt,
        userName,
        userId,
        picture,
        qtt_likes,
        like_users,
        linkMetadata,
        qtt_comments,
        qtt_reposts,
        repostUserName,
        repostId
    } = postInfo;
    /* eslint-enable */
    const focusEdit = useRef();
    const [editOn, setEditOn] = useState(false);
    const [descriptionEdit, setDescriptionEdit] = useState(description);
    const [lastDescription, setLastDescription] = useState(description);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
    const [modalRePostIsOpen, setModalRePostIsOpen] = useState(false);
    const [qttAtualRePost, setQttAtualRePost] = useState(qtt_reposts)
    const { auth } = useContext(AuthContext);
    const [likeCount, setLikeCount] = useState(qtt_likes)
    const [likeUsers, setLikeUsers] = useState(like_users)
    const [updateMetadata, setUpdateMetadata] = useState(linkMetadata)
    const [openComments, setOpenComments] = useState(false)
    const [commentHeight, setCommentHeight] = useState("0px");

    useEffect(()=> {
        if(!linkMetadata){
            metadataUpdate()
        }
    },[])
    async function metadataUpdate(){
        const update = await getMetadata(link)
        setUpdateMetadata(update)
    }

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

    function formatNumber(number) {
        if (!number) return "0";
        else if (number < 1000) return number;
        else if (number < 1000 * 1000) return Math.floor(number / 1000) + " K";
        else return Math.floor(number / (1000 * 1000)) + " M";
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
                if (userLiked) return `You, ${otherLikes[0]} and ${formatNumber(likeCount - 2)} others`;
                else return `${likeUsers[0]}, ${likeUsers[1]} and ${formatNumber(likeCount - 2)} others`;
        }
    }

    useEffect(() =>{
        if(editOn){
            focusEdit.current.focus()
            focusEdit.current.setSelectionRange(descriptionEdit.length, descriptionEdit.length)
        }
    }, [editOn]);

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
        if (event.key === "Escape" || event.key === "Esc") {
            setEditOn(false);
            setDescriptionEdit(lastDescription);
        }
    }


    function openModalDelete() {
        setModalDeleteIsOpen(true);
    }

    function closeModalDelete() {
        setModalDeleteIsOpen(false);
    }

    function openModalRePost() {
        setModalRePostIsOpen(true);
    }

    function closeModalRePost() {
        setModalRePostIsOpen(false);
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
                const updatedArr = [...posts].filter((e) => ((e.id !== id)));
                setPosts(updatedArr);
                setReload(true);
            })
            .catch((err) => {
                alert("Houve um erro ao deletar seu post")
                console.log(err.message)
            })
    }

    function handleCommentsContainer(){
        if(openComments){
            setTimeout(() => {
                setOpenComments(false);
            }, 1500);
            setCommentHeight('0px');
        } else {
            setOpenComments(true);
        }
    }

    function sendRePost(){
        const config = {
            headers: { Authorization: `Bearer ${auth.token}` }
        }
        axios.post(`${process.env.REACT_APP_API_URL}/share`, {postId: id}, config)
            .then((res) => {
                if(res.status === 201){
                    setQttAtualRePost(Number(qttAtualRePost)+1);
                    const updatedArr = [{
                        id,
                        description,
                        link,
                        createdAt,
                        userName,
                        userId,
                        picture,
                        qtt_likes,
                        like_users,
                        linkMetadata,
                        qtt_comments,
                        qtt_reposts: Number(qttAtualRePost)+1,
                        repostUserName: auth?.username,
                        repostId: res.data.repostId
                    }, ...posts];
                    setPosts(updatedArr);
                }else if(res.status === 200){
                    setQttAtualRePost(Number(qttAtualRePost)-1);
                    const updatedArr = [...posts].filter((e) => ((e.id !== id) || (auth?.username !== e.repostUserName)));
                    setPosts(updatedArr);
                }
                setReload(true);
            })
            .catch((err) => {
                alert(err.message)
            })
    }

    return (
        <>
            <ContainerStyle>
            <ReTweetStyle reTweet={repostUserName}>
                <FaRetweet size={16} />
                <p>Re-posted by { auth?.username === repostUserName ? "you" : repostUserName}</p>
            </ReTweetStyle>
            <PostContainer data-test="post" >
                <Modal
                    isOpen={modalDeleteIsOpen}
                    onRequestClose={closeModalDelete}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h2 >Are you sure you want to delete this post?</h2>
                    <div>
                        <button data-test="cancel" className="back" onClick={closeModalDelete}>No, go back</button>
                        <button data-test="confirm" className="delete" onClick={() => { closeModalDelete(); deletePost(); }}>Yes, delete it</button>
                    </div>
                </Modal>
                <Modal
                    isOpen={modalRePostIsOpen}
                    onRequestClose={closeModalRePost}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h2 >Do you want to re-post this link?</h2>
                    <div>
                        <button data-test="cancel" className="back" onClick={closeModalRePost}>No, cancel</button>
                        <button data-test="confirm" className="delete" onClick={() => { closeModalRePost(); sendRePost(); }}>Yes, share!</button>
                    </div>
                </Modal>
                <ImgLike>
                    <img src={picture} alt="profile" 
                    onError={(e) => (e.target.src = `https://cdn.hugocalixto.com.br/wp-content/uploads/sites/22/2020/07/error-404-1.png`)} />
                    {liked()}
                    <span data-test="counter" data-tooltip-id="likes-tooltip" data-tooltip-content={tooltipContent()} data-tooltip-place="bottom" >{formatNumber(likeCount)} likes</span>
                    <Tooltip  id="likes-tooltip" data-test="tooltip"
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            opacity: "1",
                            color: "#282829",
                            borderRadius: "17px",
                        }} 
                        afterShow={()=>document.querySelector('#likes-tooltip').setAttribute('data-test','tooltip')}
                        />
                    <AiOutlineComment data-test="comment-btn" onClick={handleCommentsContainer}/>
                    <span data-test="comment-counter">{formatNumber(qtt_comments)} comments</span>
                    <FaRetweet data-test="repost-btn" size={20} onClick={openModalRePost} />
                    <span data-test="repost-counter">{formatNumber(qttAtualRePost)} re-post</span>
                </ImgLike>
                <ContentContainer edit={editOn}>
                    <NameConfigPost>
                        <NavLink data-test="username" to={`/user/${userId}`} >{userName}</NavLink>
                        <PostConfig hide={myUsername === userName}>
                            <TiPencil data-test="edit-btn" onClick={editPost} />
                            <AiFillDelete data-test="delete-btn" onClick={openModalDelete} />
                        </PostConfig>
                    </NameConfigPost>
                    {
                        editOn ?
                        <textarea data-test="edit-input" ref={focusEdit} type="text" placeholder={descriptionEdit} value={descriptionEdit} disabled={!editOn} onChange={handleChange} onKeyDown={handleKeyPress} /> :
                        <HashtagDescription description={descriptionEdit} />
                    }
                    <Link data-test="link" to={link} target="_blank" >
                        <CardMetadata>
                            <div>
                                <h2>{updateMetadata?.myTitle || "Não foi possivel obter informações do link"}</h2>
                                <p>{updateMetadata?.description || ""}</p>
                                <span>{link}</span>
                            </div>
                            <img src={!updateMetadata ?
                                "https://thumbs.dreamstime.com/b/website-under-construction-internet-error-page-not-found-webpage-maintenance-error-page-not-found-message-technical-website-under-143040659.jpg" :
                                updateMetadata.image ?
                                    `${link}${updateMetadata?.image}` :
                                    updateMetadata["og:image"] || updateMetadata.myFavIcon}
                                onError={(e) => (e.target.src = `https://cdn.hugocalixto.com.br/wp-content/uploads/sites/22/2020/07/error-404-1.png`)}
                                alt="link" />
                        </CardMetadata>
                    </Link>
                </ContentContainer>
            </PostContainer>
            {openComments && <Comment auth={auth} postId={id} height={commentHeight} setHeight={setCommentHeight}/>}
            </ContainerStyle>
        </>
    )
}

const ContainerStyle = styled.div`
  width: 100%;
  background: #1e1e1e;
  border-radius: 16px;
`;

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
        zIndex: 999999,
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
    @media (max-width: 425px) {
    border-radius: 0px;
    width: 100vw;
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
        width: 25px;
        height: 25px;
        cursor: pointer;
    }
    span{
        font-family: 'Lato', sans-serif;
        font-weight: 400;
        font-size: 11px;
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

    >div:nth-child(2){
        font-family: 'Lato', sans-serif;
        font-weight: 400;
        font-size: 20px;
        color: #B7B7B7;
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
    @media (max-width: 425px) {
        div{
            max-width: 63%;
        }
        img{
            width: auto;
            max-width: 33%;
        }
       
  }
`;

const ReTweetStyle = styled.div`
    height: 33px;
    display: ${(prop) => prop.reTweet ? 'flex' : 'none'};
    align-items: center;
    gap: 6px;
    margin-left: 12px;
`;