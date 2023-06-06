import styled from "styled-components";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import postsServices from "../services/postsServices";
import HashtagDescription from "./HashtagDescription";

export default function Comment({ auth, height, setHeight, postId }) {
  const textareaRef = useRef(null);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ content: "" });
  const [commentList, setCommentList] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    setHeight("150px");
    setLoading(true);
    textareaRef.current.style.height = "0px";
    postsServices
      .listComments(auth.token, postId)
      .then(({ data }) => {
        const newHeight = data.length ? data.length * 350 : 500;
        setCommentList(data);
        setHeight(`${newHeight}px`);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert(`Error ${err.response.status}: ${err.response.data}`);
      });
  }, [reload]);

  function handleSubmit(e) {
    e?.preventDefault();
    if (!formLoading) {
      if (!form.content.length) {
        alert("You can't send an empty comment");
        return;
      }
      setFormLoading(true);
      postsServices
        .createNewComment(auth.token, postId, form)
        .then(() => {
          setForm({ content: "" });
          adjustTextareaHeight();
          setReload(!reload);
          setFormLoading(false);
        })
        .catch((err) => {
          setFormLoading(false);
          alert(`Error ${err.response.status}: ${err.response.data}`);
        });
    }
  }

  function handleChange(e) {
    setForm({ content: e.target.value });
    adjustTextareaHeight();
  }

  function adjustTextareaHeight() {
    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }

  function handleSubmitOnEnter(e) {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        handleSubmit();
      }
    }
  }

  return (
    <Container>
      <HolderAnim height={height}>
        <CommentsContainer data-test="comment-box">
          {loading && <LoadingStyle>Loading...</LoadingStyle>}
          {commentList.length > 0 &&
            commentList.map((c, index) => (
              <CommentInfo data-test="comment" key={index}>
                <img src={c.picture} alt="commenter-pic" />
                <div>
                  <div>
                    {c.userName} {c.is_following && <span> • following</span>}
                    {c.is_author && <span> • post’s author</span>}
                  </div>
                  <HashtagDescription description={c.content} />
                  {/* <div>{c.content}</div> */}
                </div>
              </CommentInfo>
            ))}
          {!loading && !commentList.length && (
            <LoadingStyle>No comments yet, be the first!</LoadingStyle>
          )}
          <NewCommentForm onSubmit={handleSubmit}>
            <img src={auth?.picture} alt="user-pic" />
            <textarea
              placeholder="write a comment..."
              data-test="comment-input"
              ref={textareaRef}
              onChange={handleChange}
              disabled={loading || formLoading}
              value={form.content}
              onKeyDown={handleSubmitOnEnter}
            />
            <button
              disabled={loading || formLoading}
              data-test="comment-submit"
              type="submit"
            >
              <IoPaperPlaneOutline size={20} />
            </button>
          </NewCommentForm>
        </CommentsContainer>
      </HolderAnim>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #acacac;
  overflow: hidden;
`;
const LoadingStyle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;
const HolderAnim = styled.div`
  transition: max-height 500ms ease-in;
  max-height: ${(props) => props.height};
`;
const CommentsContainer = styled.div`
  padding: 0px 20px 20px 20px;
  img {
    width: 39px;
    height: 39px;
    object-fit: cover;
    border-radius: 50%;
  }
`;
const CommentInfo = styled.div`
  padding: 16px 0px;
  display: flex;
  gap: 18px;
  border-bottom: 1px solid #353535;
  > div {
    min-height: 39px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  div {
    :first-child {
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: #f3f3f3;
      span {
        font-weight: 400;
        color: #565656;
      }
    }
    p,
    a {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      color: #acacac;
    }
    a {
      font-weight: 700;
      text-decoration: none;
    }
  }
`;

const NewCommentForm = styled.form`
  padding: 16px 0px 0px;
  display: flex;
  gap: 14px;
  position: relative;
  textarea {
    height: 0px;
    resize: none;
    padding: 11px 43px 11px 15px;
    border: none;
    width: 100%;
    background: #252525;
    border-radius: 8px;
    min-height: 39px;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0.05em;
    color: #acacac;
    :disabled {
      background: #212121;
    }
    ::placeholder {
      font-style: italic;
      color: #575757;
    }
    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  button {
    position: absolute;
    cursor: pointer;
    right: 16px;
    top: 49%;
    background: none;
    margin: 0px;
    padding: 0px;
    border: none;
    color: #acacac;
  }
`;
