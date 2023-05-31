import styled from "styled-components";
import { AiFillHeart, AiOutlineHeart, AiFillDelete } from "react-icons/ai";
import { TiPencil } from "react-icons/ti";

export function Post({ postInfo, myUsername }) {
    const {
        description,
        link,
        createdAt,
        userName,
        picture,
        qtt_likes,
        like_users,
        tag_array
    } = postInfo;

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

    return (
        <PostContainer>
            <ImgLike>
                <img src={picture} />
                {liked()}
                <span>{qtt_likes?qtt_likes:'0'} likes</span>
            </ImgLike>
            <ContentContainer>
                <NameConfigPost>
                    <span>{userName}</span>
                    <PostConfig>
                        <TiPencil />
                        <AiFillDelete />
                    </PostConfig>
                </NameConfigPost>
                <p>{description}</p>
                <a href="#" >{link}</a>
            </ContentContainer>
        </PostContainer>
    )
}

const PostContainer = styled.div`
    width: 100%;
    height: 275px;
    display: flex;
    background: #171717;
    border-radius: 16px;

    span, p, svg{
        color: white;
    }
`;

const ImgLike = styled.div`
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;

    img{
        width: 50px;
        height: 50px;
        border-radius: 100%;
    }
    svg{
        width: 30px;
        height: 30px;
    }
`;

const ContentContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const NameConfigPost = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const PostConfig = styled.div`
    display: flex;
`;