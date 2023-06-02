import styled from "styled-components";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import Search from "./Search";

export default function Header() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anim, setAnim] = useState("50%");

  useEffect(() => {
    if (!auth) {
      navigate("/");
    }
  }, [auth]);

  function logout() {
    localStorage.clear();
    setAuth(null);
  }

  return (
    <>
      <MyHeader>
        <h1 onClick={()=> navigate("/timeline")}>linkr</h1>
        <Search/>
        <div
          onClick={() => (anim === "120%" ? setAnim("50%") : setAnim("120%"))}
        >
          {anim === "120%" ? (
            <MdOutlineKeyboardArrowUp color="white" size={32} />
          ) : (
            <MdOutlineKeyboardArrowDown color="white" size={32} />
          )}

          <img
            src={auth?.picture}
            alt="profile"
            data-test="avatar"
            onError={(e) =>
              (e.target.src = `https://cdn.hugocalixto.com.br/wp-content/uploads/sites/22/2020/07/error-404-1.png`)
            }
          />
        </div>
      </MyHeader>
      
      <Holder transform={anim}>
        <div>
          <p onClick={logout}>Logout</p>
        </div>
        <section data-test="menu">
          <p onClick={logout} data-test="logout">
            Logout
          </p>
        </section>
      </Holder>
    </>
  );
}

const MyHeader = styled.header`
  display: flex;
  width: 100vw;
  height: 72px;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #151515;
  padding: 0px 17px;
  z-index: 99;
  h1 {
    font-family: "Passion One";
    font-style: normal;
    font-weight: 700;
    font-size: 49px;
    line-height: 54px;
    letter-spacing: 0.05em;
    color: #ffffff;
    cursor: pointer;
  }
  >div:last-child{
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 15px;
    >img {
      object-fit: cover;
      border-radius: 50%;
      height: 53px;
      width: 53px;
    }
  }
`;
const Holder = styled.div`
  height: 72px;
  position: relative;
  div {
    position: fixed;
    right: 0;
    width: 133px;
    height: 47px;
    transition: transform 250ms ease-in;
    transform: ${(props) => `translateY(${props.transform})`};
    background: #171717;
    border-radius: 0px 0px 0px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      font-family: "Lato", sans-serif;
      font-style: normal;
      font-weight: 700;
      font-size: 17px;
      line-height: 20px;
      letter-spacing: 0.05em;
      color: #ffffff;
      cursor: pointer;
    }
  }
  section {
    position: fixed;
    z-index: -50;
    right: 0;
    width: 43px;
    height: 47px;
    display: ${(props) => (props.transform === "50%" ? "none" : "flex")};
  }
`;
