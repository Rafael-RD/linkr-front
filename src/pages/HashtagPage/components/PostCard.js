import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { AiFillDelete, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import styled from "styled-components";
import HashtagDescription from "../../../components/HashtagDescription";
import AuthContext from "../../../context/auth.context";
import { getMetadata } from "../../../utils/metadataRequest";
import Modal from "react-modal";
import { TiPencil } from "react-icons/ti";

export default function PostCard({ item, setReload, postList, setPostList }) {
  const focusEdit = useRef();
  const { auth } = useContext(AuthContext);
  const myUsername = auth.username;
  const {
    id,
    userId,
    picture,
    hasLiked,
    qtt_likes,
    userName,
    description,
    linkMetadata,
    link,
    like_users,
  } = item;
  const [likeCount, setLikeCount] = useState(qtt_likes);
  const [likeUsers, setLikeUsers] = useState(like_users);
  const [updateMetadata, setUpdateMetadata] = useState(linkMetadata);
  const [editOn, setEditOn] = useState(false);
  const [descriptionEdit, setDescriptionEdit] = useState(description);
  const [lastDescription, setLastDescription] = useState(description);
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!linkMetadata) {
      metadataUpdate();
    }
  }, []);
  async function metadataUpdate() {
    const update = await getMetadata(link);
    setUpdateMetadata(update);
  }

  function tooltipContent() {
    if (!Number(likeCount)) return null;
    const userLiked = likeUsers?.includes(myUsername);
    const otherLikes = [...likeUsers];
    otherLikes?.splice(likeUsers.indexOf(myUsername), 1);
    switch (likeCount) {
      case "1":
        if (userLiked) return "You";
        else return likeUsers[0];

      case "2":
        if (userLiked) return `You and ${otherLikes[0]}`;
        else return `${likeUsers[0]} and ${likeUsers[1]}`;

      case "3":
        if (userLiked) return `You, ${otherLikes[0]} and 1 other`;
        else return `${likeUsers[0]}, ${likeUsers[1]} and 1 other`;

      default:
        if (userLiked)
          return `You, ${otherLikes[0]} and ${showLikes(likeCount - 2)} others`;
        else
          return `${likeUsers[0]}, ${likeUsers[1]} and ${showLikes(
            likeCount - 2
          )} others`;
    }
  }

  function showLikes(likes) {
    if (!likes) return "0";
    else if (likes < 1000) return likes;
    else if (likes < 1000 * 1000) return Math.floor(likes / 1000) + " K";
    else return Math.floor(likes / (1000 * 1000)) + " M";
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
    if (event.key === "Enter") {
      setEditOn(false);
      pacthPostEdit();
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
      headers: { Authorization: `Bearer ${auth.token}` },
    };

    const objeto = {
      description: descriptionEdit,
      postId: id,
    };
    axios
      .patch(`${process.env.REACT_APP_API_URL}/post`, objeto, config)
      .then((res) => {
        setLastDescription(descriptionEdit);
      })
      .catch((err) => {
        alert("Houve um erro ao editar seu post");
        console.log(err.message);
      });
  }

  function deletePost() {
    const config = {
      headers: { Authorization: `Bearer ${auth.token}` },
    };
    axios
      .delete(`${process.env.REACT_APP_API_URL}/post/${id}`, config)
      .then((res) => {
        setReload(true);
        const updatedArr = [...postList].filter(e => e.id !== id)
        setPostList(updatedArr)
      })
      .catch((err) => {
        alert("Houve um erro ao deletar seu post");
        console.log(err.message);
      });
  }

  return (
    <li data-test="post">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>Are you sure you want to delete this post?</h2>
        <div>
          <button className="back" data-test="cancel" onClick={closeModal}>
            No, go back
          </button>
          <button
          data-test="confirm"
            className="delete"
            onClick={() => {
              closeModal();
              deletePost();
            }}
          >
            Yes, delete it
          </button>
        </div>
      </Modal>
      <ItemNav>
        <img
          src={picture}
          alt="user-pic"
          onError={(e) =>
            (e.target.src = `https://cdn.hugocalixto.com.br/wp-content/uploads/sites/22/2020/07/error-404-1.png`)
          }
        />
        <LikeInfo>
          {hasLiked ? (
            <AiFillHeart color={"red"} size={20} data-test="like-btn" />
          ) : (
            <AiOutlineHeart color={"white"} size={20} data-test="like-btn" />
          )}
          <p
            data-test="counter"
            data-tooltip-id="likes-tooltip"
            data-tooltip-content={tooltipContent()}
            data-tooltip-place="bottom"
          >
            {qtt_likes} likes
          </p>
          <Tooltip
            data-test="tooltip"
            id="likes-tooltip"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              opacity: "1",
              color: "#282829",
              borderRadius: "17px",
            }}
          />
        </LikeInfo>
      </ItemNav>
      <PostInfo>
        <NameConfig>
          <Link to={`/user/${userId}`} data-test="username">
            {userName}
          </Link>
          <PostConfig hide={myUsername === userName}>
            <TiPencil data-test="edit-btn" onClick={editPost} color="white" />
            <AiFillDelete
              data-test="delete-btn"
              onClick={openModal}
              color="white"
            />
          </PostConfig>
        </NameConfig>
        {editOn ? (
          <textarea
            ref={focusEdit}
            type="text"
            placeholder={descriptionEdit}
            value={descriptionEdit}
            disabled={!editOn}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            data-test="edit-input"
          />
        ) : (
          <HashtagDescription description={descriptionEdit} />
        )}
        <Link to={link} target="_blank" data-test="link">
          <MetaDataContainer>
            <div>
              <h4>
                {updateMetadata?.myTitle ||
                  "Não foi possivel obter informações do link"}
              </h4>
              <p>{updateMetadata?.description || ""}</p>
              <span>{link}</span>
            </div>
            <section>
              <img
                src={
                  !updateMetadata
                    ? "https://thumbs.dreamstime.com/b/website-under-construction-internet-error-page-not-found-webpage-maintenance-error-page-not-found-message-technical-website-under-143040659.jpg"
                    : updateMetadata.image
                    ? `${link}${updateMetadata?.image}`
                    : updateMetadata["og:image"] || updateMetadata.myFavIcon
                }
                alt="link-display"
                onError={(e) =>
                  (e.target.src = `https://cdn.hugocalixto.com.br/wp-content/uploads/sites/22/2020/07/error-404-1.png`)
                }
              />
            </section>
          </MetaDataContainer>
        </Link>
      </PostInfo>
    </li>
  );
}

const ItemNav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 19px;
  min-width: 50px;
  img {
    min-width: 50px;
    width: 50px;
    min-height: 50px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
  }
  svg {
    cursor: pointer;
    width: 35px;
    height: 35px;
  }
  p {
    cursor: default;
  }
`;

const LikeInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 4px;
  width: 100%;
  p {
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    text-align: center;
    color: #ffffff;
  }
`;

const MetaDataContainer = styled.div`
  border: 1px solid #4d4d4d;
  border-radius: 11px;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  height: 155px;
  div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px 27px 23px 19px;
    h4 {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      color: #cecece;
      min-height: 19px;
      max-height: 38px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    p {
      margin-top: 5px;
      font-style: normal;
      font-weight: 400;
      font-size: 11px;
      line-height: 13px;
      color: #9b9595;
      min-height: 13px;
      max-height: 52px;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    span {
      font-style: normal;
      font-weight: 400;
      font-size: 11px;
      line-height: 13px;
      color: #cecece;
    }
  }
  section {
    position: relative;
    min-width: 153px;
    width: 153px;
    height: 153px;
    img {
      position: absolute;
      bottom: 49.7%;
      right: 49.2%;
      transform: translate(50%, 50%);
      min-width: 156px;
      width: 156px;
      height: 156px;
      object-fit: cover;
      border-radius: 0px 12px 13px 0px;
    }
  }
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 7px;
  max-width: 503px;
  width: 503px;
  a {
    font-size: 19px;
    line-height: 23px;
    color: #ffffff;
  }
  p,
  textarea {
    font-size: 17px;
    line-height: 20px;
    font-weight: 400;
    color: #b7b7b7;
    a {
      font-weight: 700;
      color: white;
    }
  }
  textarea {
    color: black;
  }
`;

const customStyles = {
  content: {
    position: "absolute",
    top: "calc(50% - 131px)",
    left: "calc(50% - 298px)",
    right: "auto",
    bottom: "auto",
    width: "597px",
    height: "262px",
    background: "#333333",
    borderRadius: "50px",
  },
};

const PostConfig = styled.div`
  display: ${(prop) => (prop.hide ? "flex" : "none")};
  gap: 10px;
  svg {
    width: 18px;
    height: 18px;
  }
`;

const NameConfig = styled.div`
  display: flex;
  justify-content: space-between;
  a {
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
    font-size: 19px;
    line-height: 23px;
    color: #ffffff;
  }
`;
