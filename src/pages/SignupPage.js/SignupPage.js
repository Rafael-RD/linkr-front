import styled from "styled-components";
import { Link } from "react-router-dom";
import Banner from "../../components/Banner";

export default function SignupPage() {
  return (
    <SignupStyle>
      <Banner />
      <section>
        <form>
          <input
            placeholder="e-mail"
            required
            type="email"
            name="email"
            autoComplete="email"
          />
          <input
            placeholder="password"
            required
            type="password"
            name="password"
            autoComplete="password"
            minLength="3"
          />
          <input
            placeholder="username"
            required
            type="text"
            name="name"
            autoComplete="name"
          />
          <input placeholder="picture url" required type="url" name="picture" />
          <button>Sign Up</button>
          <Link to="/">Switch back to log in</Link>
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
`;
