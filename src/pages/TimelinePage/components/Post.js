import styled from "styled-components";
import { AiFillHeart, AiOutlineHeart, AiFillDelete } from "react-icons/ai";
import { TiPencil } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../../../context/auth.context.js";
import axios from "axios";
import Modal from 'react-modal';

export function Post({ postInfo, myUsername }) {
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
    const [modalIsOpen, setIsOpen] = useState(false);
    const { auth } = useContext(AuthContext);
    let subtitle;

    function liked() {
        if (like_users?.includes(myUsername)) {
            return (
                <AiFillHeart />
            )
        } else {
            return (
                <AiOutlineHeart />
            )
        }
    }

    function showLikes() {
        if (!qtt_likes) return "0";
        else if (qtt_likes < 1000) return qtt_likes;
        else if (qtt_likes < 1000 * 1000) return Math.floor(qtt_likes / 1000) + " K";
        else return Math.floor(qtt_likes / (1000 * 1000)) + " M";
    }

    async function editPost() {
        console.log("Editar Post");
        if (!editOn) {
            focusEdit.current.focus()
            setEditOn(true);
            console.log(editOn)
        } else {
            focusEdit.current.blur();
            setEditOn(false);
            setDescriptionEdit(description);
            console.log(editOn)
        }
    }

    async function deletePost() {
        const config = {
            headers: { Authorization: `Bearer ${auth.token}` }
        }

        const objeto = {
            postId: id
        }
        axios.delete(`${process.env.REACT_APP_API_URL}/post`, objeto, config)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                alert("Houve um erro ao deletar seu post")
                console.log(err.message)
            })
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
                console.log(res.data)
            })
            .catch((err) => {
                alert("Houve um erro ao editar seu post")
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
                <h2 >Are you sure you want
                    to delete this post?</h2>
                <button class="back" onClick={closeModal}>No, go back</button>
                <button class="delete" onClick={() => {closeModal(); deletePost();} }>Yes, delete it</button>
            </Modal>
            <ImgLike>
                <img src={picture} alt="profile" />
                {liked()}
                <span>{showLikes()} likes</span>
            </ImgLike>
            <ContentContainer edit={editOn}>
                <NameConfigPost>
                    <span>{userName}</span>
                    <PostConfig hide={myUsername === userName}>
                        <TiPencil onClick={editPost} />
                        <AiFillDelete onClick={openModal} />
                    </PostConfig>
                </NameConfigPost>
                <textarea ref={focusEdit} type="text" placeholder={descriptionEdit} value={descriptionEdit} disabled={!editOn} onChange={handleChange} onKeyPress={handleKeyPress} />
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

    button{
        position: absolute;
        width: 134px;
        height: 37px;
        left: 572px;
        top: 508px;
        border-radius: 5px;
    }
    .back{
        background: #FFFFFF;
    }
    .delete{
        background: #1877F2;
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

    textarea{
        width: 100%;
        font-family: 'Lato', sans-serif;
        font-weight: 400;
        font-size: 20px;
        color: #B7B7B7;
        background-color: ${(prop) => prop.edit ? '#FFFFFF' : 'transparent'};
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