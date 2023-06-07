import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Banner from "../../components/Banner";
import { useContext, useEffect, useState } from "react";
import authServices from "../../services/authServices";
import AuthContext from "../../context/auth.context";

export default function SignupPage() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    image: "",
  });

  useEffect(() => {
    if (auth) {
      navigate("/timeline");
    }
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validation =
      !form.email || !form.password || !form.username || !form.image;
    if (validation) {
      return alert("Error 422: None of the fields can be empty");
    }
    setLoading(true);
    authServices
      .signup(form)
      .then(() => navigate("/"))
      .catch((err) => {
        setLoading(false);
        alert(`Error ${err.response.status}: ${err.response.data}`);
      });
  }

  return (
    <SignupStyle>
      <Banner />
      <section>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="e-mail"
            type="email"
            name="email"
            autoComplete="email"
            onChange={handleChange}
            value={form.email}
            disabled={loading}
            data-test="email"
          />
          <input
            placeholder="password"
            type="password"
            name="password"
            autoComplete="password"
            minLength="3"
            onChange={handleChange}
            value={form.password}
            disabled={loading}
            data-test="password"
          />
          <input
            placeholder="username"
            type="text"
            name="username"
            onChange={handleChange}
            value={form.username}
            disabled={loading}
            data-test="username"
          />
          <input
            placeholder="picture url"
            type="url"
            name="image"
            onChange={handleChange}
            value={form.image}
            disabled={loading}
            data-test="picture-url"
          />
          <button type="submit" disabled={loading} data-test="sign-up-btn">
            Sign Up
          </button>
          <Link to="/" data-test="login-link">
            Switch back to log in
          </Link>
        </form>
      </section>
    </SignupStyle>
  );
}

const SignupStyle = styled.div`
  background: #333333;
  color: white;
  width: 100vw;
  height: 100vh;
  display: flex;
  > section {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    form {
      display: flex;
      flex-direction: column;
      gap: 13px;
      align-items: center;
      width: 80%;
      input {
        width: 100%;
        background: #ffffff;
        border-radius: 6px;
        border: none;
        font-family: "Oswald";
        font-style: normal;
        font-weight: 700;
        font-size: 27px;
        line-height: 40px;
        padding: 9px 17px 16px;
        ::placeholder {
          color: #9f9f9f;
        }
        :disabled {
          background: #dbdbdb;
        }
      }
      button {
        width: 100%;
        background: #1877f2;
        border-radius: 6px;
        font-family: "Oswald";
        font-style: normal;
        font-weight: 700;
        font-size: 27px;
        line-height: 40px;
        color: #ffffff;
        border: none;
        padding: 10px 0px 15px;
        :disabled {
          background: #1565cf;
        }
      }
    }
    a {
      font-family: "Lato";
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 24px;
      text-decoration-line: underline;
      color: #ffffff;
    }
  }
  @media (max-width: 425px) {
    flex-direction: column;
    > section {
      a {
        font-weight: 400;
        font-size: 17px;
        line-height: 20px;
        text-decoration-line: underline;
        color: #ffffff;
      }
    }
  }
`;
