import { useContext, useState } from "react";
import styled from "styled-components";
import { HiOutlineSearch } from "react-icons/hi"
import { DebounceInput } from 'react-debounce-input';
import AuthContext from "../context/auth.context";
import axios from "axios";
export default function Search() {
    const [search, setSearch] = useState()
    const [border, setBorder] = useState("normal")
    const [noUser, setNoUser] = useState()
    const { auth } = useContext(AuthContext);

    async function evento(value) {
        const valor = { search: value }
        const config = {
            headers: { Authorization: `Bearer ${auth.token}` }
        }
        if (value.length >= 3) {
            axios.post(`${process.env.REACT_APP_API_URL}/searchUsers`, valor, config)
                .then((res) => {
                    if(res.data.length > 0){
                        setSearch(res.data)
                        setBorder("square")
                        setNoUser()
                    }
                    else{
                        setSearch()
                        setBorder("square")
                        setNoUser("1")
                    }                    
                })
                .catch((err) => {
                    alert(err.message)
                })
        }
        else {
            setSearch()
            setNoUser()
            setBorder("normal")
        }
    }

    return (
        <TotalContainer>
            <InputContainer border={border} >
                <form>
                    <div>
                        <DebounceInput
                            data-test="search"
                            placeholder="Search for people"
                            minLength={3}
                            debounceTimeout={300}
                            onChange={event => {
                                evento(event.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <HiOutlineSearch color="#C6C6C6" size={21} />
                    </div>
                </form>
            </InputContainer>
            {search ? (
                <UsersContainer>
                    {search?.map((user) =>
                        <Users data-test="user-search">
                            <img src={user?.picture} />
                            <p>{user?.userName}</p>
                        </Users>
                    )}
                </UsersContainer>) : <></>}
            {noUser ? (
                <SemUser><p>Usuário Não Encontrado :(</p></SemUser>            
            ) : <></>}
        </TotalContainer>
    );
}
const TotalContainer = styled.div`
    font-family: 'Lato', sans-serif;
    width: 50%;
    display: flex;
    flex-direction: column;
    left: 25%;
    top: 15px;
    position: absolute;
    z-index: 5;
`

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px;
    width: 100%;
    height: 45px;
    background: #FFFFFF;
    border-radius: ${props => props.border === "normal" ? "8px" : "8px 8px 0 0"};
    form{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100%;
        input{
            border: none;
            margin-left: 6px;
            width: 95%;
        }
        input:focus {
            box-shadow: 0 0 0 0;
            outline: 0;
        }
        div:first-child{
            width: 100%;
        }
        div:last-child{
            height: 21px;
            width: 21px;
            cursor: pointer;
        }   
    }
`

const UsersContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #E7E7E7;
    border-radius: 0 0 8px 8px;
    padding: 8px 8px 16px 8px;
    gap: 15px;
`
const Users = styled.div`
    gap: 0;
    width: 100%;
    display: flex;
    height: 40px;
    background-color: #E7E7E7;
    align-items: center;
    gap: 15px;
    img{
        width: 39px;
        height: 39px;
        border-radius: 50%;
        margin-left: 11px;
    }
    p{
        font-family: 'Lato', sans-serif;
        margin-left: 12px;
        font-weight: 400;
        font-size: 19px;
        line-height: 23px;
        color: #515151;
        cursor: pointer;
    }
    p:hover{
        color: black;
    }
`

const SemUser = styled.div`
    gap: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #E7E7E7;
    justify-content: center;
    border-radius: 0 0 8px 8px;
    padding: 6px;
    gap: 10px;
    height: 52px;
    p{
        font-family: 'Lato', sans-serif;
        margin-left: 12px;
        font-weight: 400;
        font-size: 14px;
        line-height: 23px;
        color: #515151;
    }
`

