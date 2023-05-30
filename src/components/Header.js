import styled from "styled-components";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useContext, useEffect } from "react";
import AuthContext from "../context/auth.context";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

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
        <h1>linkr</h1>
        <div>
          <MdOutlineKeyboardArrowDown color="white" size={32} />
          <img src={auth?.picture} alt="profile" />
        </div>
      </MyHeader>
      <Holder>
        <div>
          <p onClick={logout}>Logout</p>
        </div>
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
  }
  div {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 15px;
    img {
      object-fit: cover;
      border-radius: 50%;
      height: 53px;
      width: 53px;
    }
  }
`;
const Holder = styled.div`
  width: 100vw;
  height: 72px;
  position: relative;
  div {
    position: absolute;
    right: 0;
    width: 133px;
    height: 47px;
    transform: translateY(120%);
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
    }
  }
`;
