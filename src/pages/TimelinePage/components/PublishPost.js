import { useContext, useEffect, useState } from "react";
import styled from "styled-components"
import axios from "axios";
import AuthContext from "../../../context/auth.context";


export function PublishPost({reload, setReload, posts, setPosts}) {
    const { auth } = useContext(AuthContext);
    const [disable, setDisable] = useState(false);
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
        if(form.link === "" || form.link === null || form.link === undefined){
            alert("There was an error publishing your link")
            setDisable(false)
        }
        else{        
        
        const config = {
            headers: { Authorization: `Bearer ${auth.token}` }
        } 
        axios.post(`${process.env.REACT_APP_API_URL}/post`, form, config)
                .then((res) => {
                    setDisable(false)
                    setForm({link: "", description: ""})
                    setPosts([{...form, id: res.data.id, userName: auth.username, picture: auth.picture, linkMetadata: null}, ...posts]);
                    setReload(true);
                })
                .catch((err) => {
                    alert("There was an error publishing your link")
                    console.log(err.message)
                    setDisable(false)
                })
        }
    }

    return(
        <PostContent data-test="publish-box">
        <img src={auth?.picture}
        alt="Imagem do Usuário"
        onClick={()=>setForm({link: "https://teste.com", description: `testando um bagulhinho aqui de leve ${(new Date()).toString()} #paz`})}/>
        <form onSubmit={postLink}>
            <p>What are you going to share today?</p>
            <input
                data-test="link" 
                placeholder="http://..."
                name="link"
                value={form.link}
                disabled={disable}
                // required
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
    )
}
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
    @media (max-width: 425px) {
    width: 100%;
    height: 184px;
    justify-content: center;
    padding: 10px 15px 16px 15px;
    border-radius: 0px;
    img{
        display: none;
    }
    p{
        width: 100%;
        text-align: center;
        height: 30px;
        font-size: 17px;
    }
    form{
        width: 100%;
        input, p, textarea{
            width: 100%;
        }
        button{
            width: 112px;
            height: 22px;
            font-size: 13px;
        }
        textarea{
            height: 52px;
            resize: none;
        }
    }
  }
`