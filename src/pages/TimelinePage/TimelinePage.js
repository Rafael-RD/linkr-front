import styled from "styled-components";
import Header from "../../components/Header"
import { useContext, useState } from "react";
import AuthContext from "../../context/auth.context";
import axios from "axios";
import { Timeline } from "./components/Timeline.js";
import TrendingList from "../../components/TrendingList";

export default function TimelinePage() {
    const { auth } = useContext(AuthContext);
    const [disable, setDisable] = useState(false)
    const [form, setForm] = useState({
        link: "",
        description: ""
      });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function postLink(e){
        e.preventDefault();
        setDisable(true)
        const config = {
            headers: { Authorization: `Bearer ${auth.token}` }
        } 
        axios.post(`${process.env.REACT_APP_API_URL}/post`, form, config)
                .then((res) => {
                    setDisable(false)
                    //Retorna o Id do Post criado!!!
                    console.log(res.data)
                    setForm({link: "", description: ""})
                })
                .catch((err) => {
                    alert("Houve um erro ao publicar seu link")
                    console.log(err.message)
                    setDisable(false)
                })
    }

    return(
        <>
        <Header/>
        <TimeLineContainer>
            <Container>
                <h1>timeline</h1>
            <Wrapper>
            <ContentContainer>
                <PostContent data-test="publish-box">
                    <img src={auth?.picture}
                    alt="Imagem do Usuário"/>
                    <form onSubmit={postLink}>
                        <p>What are you going to share today?</p>
                        <input
                            data-test="link" 
                            placeholder="http://..."
                            name="link"
                            value={form.link}
                            disabled={disable}
                            onChange={handleChange} />
                        <textarea
                            data-test="description"
                            placeholder="Awesome article about #javascript"
                            name="description"
                            value={form.description}
                            disabled={disable}
                            onChange={handleChange} />
                            {disable ? (
                                <button data-test="publish-btn" type="submit" disabled={disable}>Publishing...</button>
                            ) : (
                                <button data-test="publish-btn" type="submit" disabled={disable}>Publish</button>
                            )}
                    </form>
                </PostContent>
                <Timeline />
            </ContentContainer>
            <TrendingList/>
            </Wrapper>
            </Container>
        </TimeLineContainer>
        </>
    )
}

const TimeLineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding-bottom: 80px;
        h1{
        font-family: 'Oswald', sans-serif;
        color: white;
        font-weight: 700;
        font-size: 43px;
        width: 100%;
        margin-bottom: 43px;
    }

`

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 611px;
    height: 100%;
    h1{
        font-family: 'Oswald', sans-serif;
        color: white;
        font-weight: 700;
        font-size: 43px;
        width: 100%;
    }
`
const PostContent = styled.div`
    width: 100%;
    max-width: 611px;
    height: 209px;
    border-radius: 16px;
    background-color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    padding: 16px;
    img{
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 50%;
    }
    form{
        display: flex;
        flex-direction: column;
        position: relative;
        input, p, textarea{
            width: 503px;
            height: 30px;
            border-radius: 5px;
            background-color: #EFEFEF;
            border: none;
            margin-bottom: 5px;
            font-family: 'Lato', sans-serif;
            font-weight: 300;
            line-height: 18px;
            padding: 10px;
        }
        p {
            background-color: white;
            height: 40px;
            font-size: 20px;
            color: #707070;
            line-height: 24px;
            margin-bottom: 0px;
        }
        textarea{
            display: flex;
            height: 66px;
            resize: none;
        }
        button{
            width: 112px;
            height: 31px;
            background-color: #1877f2;
            border-radius: 5px;
            border: none;
            position: absolute;
            bottom: 0px;
            right: 0px;
            font-family: 'Lato', sans-serif;
            font-weight: 700;
            font-size: 14px;
            color: white;
            cursor: pointer;

        }       
    }
`
const Wrapper =styled.div`
  display: flex;
  gap: 41px;
`
const Container = styled.div`
    margin-top: 53px;
`