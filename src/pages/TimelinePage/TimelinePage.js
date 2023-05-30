import styled from "styled-components";
import Header from "../../components/Header"
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth.context";
import axios from "axios";

export default function TimelinePage() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    console.log("token",auth)
    const [user, setUser] = useState()
    const [form, setForm] = useState({
        description: "",
        link: "",
        tags: ""
      });

    // useEffect(() => {
    //     if(auth){
    //         // const config = {
    //         //     headers: { Authorization: `Bearer ${auth.token}` }
    //         // }        
    //     //     axios.get(`${process.env.REACT_APP_API_URL}/user`, config)
    //     //         .then((res) => {
    //     //             setUser(res.data)
    //     //             console.log(res.data)
    //     //         })
    //     //         .catch((err) => alert("Error!!!"))
    //     // }                
    // }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function postLink(e){
        e.preventDefault();
        // alert("form")
        console.log("form", form)
        const config = {
            headers: { Authorization: `Bearer ${auth.token}` }
        } 
        // alert("form") 
        axios.post(`${process.env.REACT_APP_API_URL}/post`, form, config)
                .then((res) => {
                    console.log(res.data)
                })
                .catch((err) => alert(err.mesage))
    }

    return(
        <TimeLineContainer>
            <Header/>
            <ContentContainer>                
                <h1>timeline</h1>
                <PostContent>
                    <img src="https://img.freepik.com/fotos-premium/aviao-decolando-do-aeroporto_37416-74.jpg"
                    alt="Imagem do Usuário"/>
                    <form onSubmit={postLink}>
                        <input 
                            placeholder="What are you going to share today?"
                            name="description"
                            value={form.description}
                            onChange={handleChange} />
                        <input 
                            placeholder="http://..."
                            name="link"
                            value={form.link}
                            onChange={handleChange} />
                        <input 
                            placeholder="Awesome article about #javascript"
                            name="tags"
                            value={form.tags}
                            onChange={handleChange} />
                        <button type="submit">Publish</button>
                    </form>
                </PostContent>

            </ContentContainer>
        </TimeLineContainer>
    )
}

const TimeLineContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: calc(100vh);
    background-color: #333333;
`

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 611px;
    height: 100%;
    /* background-color: lightsteelblue; */
    margin-top: 78px;
    h1{
        font-family: 'Oswald', sans-serif;
        color: white;
        font-weight: 700;
        font-size: 43px;
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
    margin-top: 43px;
    padding: 16px;
    /* position: absolute; */
    img{
        width: 50px;
        height: 50px;
        border-radius: 26.5px;
        /* cursor: pointer; */
    }
    form{
        display: flex;
        flex-direction: column;
        position: relative;
        input{
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
        input:first-child {
            background-color: white;
            height: 40px;
            font-size: 20px;
            color: #707070;
            line-height: 24px;
            margin-bottom: 0px;
        }
        input:nth-child(3){
            display: flex;
            height: 66px;
            
            ::placeholder{
                position: absolute;
            }            
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