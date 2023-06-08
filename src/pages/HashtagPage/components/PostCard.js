import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import {
  AiFillDelete,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineHeart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import styled from "styled-components";
import HashtagDescription from "../../../components/HashtagDescription";
import AuthContext from "../../../context/auth.context";
import { getMetadata } from "../../../utils/metadataRequest";
import Modal from "react-modal";
import { TiPencil } from "react-icons/ti";
import Comment from "../../../components/Comment";
import { FaRetweet } from "react-icons/fa";

export default function PostCard({ item, setReload, postList, setPostList }) {
  const focusEdit = useRef();
  const { auth } = useContext(AuthContext);
  const myUsername = auth.username;
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
    qtt_comments,
    qtt_reposts,
    repostUserName,
    hasLiked,
    linkMetadata,
  } = item;
  const [editOn, setEditOn] = useState(false);
  const [descriptionEdit, setDescriptionEdit] = useState(description);
  const [lastDescription, setLastDescription] = useState(description);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalRePostIsOpen, setModalRePostIsOpen] = useState(false);
  const [qttAtualRePost, setQttAtualRePost] = useState(qtt_reposts);
  const [likeCount, setLikeCount] = useState(qtt_likes);
  const [likeUsers, setLikeUsers] = useState(like_users);
  const [commentAmount, setCommentAmount] = useState(qtt_comments)
  const [userLikedThisPost, setUserLikedThisPost] = useState(hasLiked);
  const [updateMetadata, setUpdateMetadata] = useState(linkMetadata);
  const [openComments, setOpenComments] = useState(false);
  const [commentHeight, setCommentHeight] = useState("0px");
  let disable = false;

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

  function sendRePost() {
    const config = {
      headers: { Authorization: `Bearer ${auth?.token}` },
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/share`, { postId: id }, config)
      .then((res) => {
        console.log(res);
        setQttAtualRePost(Number(qttAtualRePost) + 1);
      })
      .catch((err) => {
        alert(err.message);
      });
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
        const updatedArr = [...postList].filter((e) => e.id !== id);
        setPostList(updatedArr);
      })
      .catch((err) => {
        alert("Houve um erro ao deletar seu post");
        console.log(err.message);
      });
  }

  function like() {
    const post = String(id);
    const config = {
      headers: { Authorization: `Bearer ${auth.token}` },
    };
    if (disable) return;
    disable = true;
    axios
      .post(`${process.env.REACT_APP_API_URL}/likes/${post}`, {}, config)
      .then((res) => {
        disable = false;
        let like_users_copy = [];
        if (like_users) {
          like_users_copy = [...like_users];
        }
        if (res.data[0]?.user_liked && !like_users_copy.includes(myUsername)) {
          like_users_copy.push(myUsername);
        }
        if (!res.data[0]?.user_liked && like_users_copy.includes(myUsername)) {
          like_users_copy = like_users_copy.filter((e) => e !== myUsername);
        }
        setLikeCount(res.data[0]?.qtt_likes || 0);
        setLikeUsers(like_users_copy);
        setUserLikedThisPost(!userLikedThisPost);
      })
      .catch((err) => {
        alert(err.message);
        disable = false;
      });
  }

  function handleCommentsContainer() {
    if (openComments) {
      setTimeout(() => {
        setOpenComments(false);
      }, 1500);
      setCommentHeight("0px");
    } else {
      setOpenComments(true);
    }
  }

  return (
    <li data-test="post">
      {repostUserName && (
        <RepostStyle>
          <FaRetweet size={16} />
          Re-posted by {repostUserName}
        </RepostStyle>
      )}
      <Modal
        isOpen={modalDeleteIsOpen}
        onRequestClose={closeModalDelete}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>Are you sure you want to delete this post?</h2>
        <div>
          <button
            data-test="cancel"
            className="back"
            onClick={closeModalDelete}
          >
            No, go back
          </button>
          <button
            data-test="confirm"
            className="delete"
            onClick={() => {
              closeModalDelete();
              deletePost();
            }}
          >
            Yes, delete it
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={modalRePostIsOpen}
        onRequestClose={closeModalRePost}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>Do you want to re-post this link?</h2>
        <div>
          <button
            data-test="cancel"
            className="back"
            onClick={closeModalRePost}
          >
            No, cancel
          </button>
          <button
            data-test="confirm"
            className="delete"
            onClick={() => {
              closeModalRePost();
              sendRePost();
            }}
          >
            Yes, share!
          </button>
        </div>
      </Modal>
      <PostContent>
        <ItemNav>
          <img
            src={picture}
            alt="user-pic"
            onError={(e) =>
              (e.target.src = `https://cdn.hugocalixto.com.br/wp-content/uploads/sites/22/2020/07/error-404-1.png`)
            }
          />
          <LikeInfo>
            {userLikedThisPost ? (
              <AiFillHeart
                color={"red"}
                size={25}
                data-test="like-btn"
                onClick={!disable ? like : null}
              />
            ) : (
              <AiOutlineHeart
                color={"white"}
                size={25}
                data-test="like-btn"
                onClick={!disable ? like : null}
              />
            )}
            <p
              data-test="counter"
              data-tooltip-id="likes-tooltip"
              data-tooltip-content={tooltipContent()}
              data-tooltip-place="bottom"
            >
              {showLikes(likeCount)} likes
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
              afterShow={() =>
                document
                  .querySelector("#likes-tooltip")
                  .setAttribute("data-test", "tooltip")
              }
            />
            <AiOutlineComment
              data-test="comment-btn"
              onClick={handleCommentsContainer}
            />
            <p data-test="comment-counter">
              {showLikes(commentAmount)} comments
            </p>
            <FaRetweet
              data-test="repost-btn"
              size={20}
              onClick={openModalRePost}
            />
            <p data-test="repost-counter">
              {showLikes(qttAtualRePost)} re-post
            </p>
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
                onClick={openModalDelete}
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
      </PostContent>
      {openComments && (
        <Comment
          auth={auth}
          postId={id}
          height={commentHeight}
          setHeight={setCommentHeight}
          setCommentAmount={setCommentAmount}
        />
      )}
    </li>
  );
}
const PostContent = styled.div`
  width: 611px;
  max-width: 611px;
  min-height: 276px;
  height: 276px;
  max-height: 276px;
  background: #171717;
  border-radius: 16px;
  display: flex;
  gap: 9px;
  justify-content: space-between;
  padding: 18px;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  @media (max-width: 425px) {
    width: 100%;
    max-width: 100%;
    min-height: auto;
    height: auto;
    max-height: 100%;
    border-radius: 0px;
    justify-content: space-between;
  }
`;

const ItemNav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 19px;
  min-width: 85px;
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
    width: 25px;
    height: 25px;
    :not(:first-child) {
      margin-top: 13px;
    }
  }
  p {
    cursor: default;
  }
  @media (max-width: 425px) {
    img {
      min-width: 40px;
      width: 40px;
      min-height: 40px;
    }
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
    overflow-wrap: break-word;
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
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
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
  @media (max-width: 425px) {
    min-height: 115px;
    height: auto;
    div {
      padding: 7px 0px 8px 11px;
      max-width: 62%;
      h4 {
        font-weight: 400;
        font-size: 11px;
        line-height: 13px;
      }
      p {
        margin-top: 0px;
        font-size: 9px;
        line-height: 11px;
        min-height: 11px;
        max-height: 44px;
      }
      span {
        font-size: 9px;
        line-height: 11px;
      }
    }
    section {
      min-width: 36%;
      width: 36%;
      height: auto;
      img {
        position: static;
        transform: translate(0%, 0%);
        min-width: auto;
        width: 100%;
        height: 100%;
      }
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
  @media (max-width: 425px) {
    width: 80%;
    max-width: 80%;
    p,
    a,
    textarea {
      font-size: 15px;
      line-height: 18px;
    }
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
    @media (max-width: 425px) {
      font-size: 17px;
      line-height: 20px;
    }
  }
`;

const RepostStyle = styled.article`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  color: #ffffff;
`;
