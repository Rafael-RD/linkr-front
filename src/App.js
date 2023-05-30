import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.js";
import styled from "styled-components";
import SignupPage from "./pages/SignupPage.js/SignupPage.js";
import { AuthProvider } from "./context/auth.context.js";
import TimelinePage from "./pages/TimelinePage/TimelinePage.js";

function App() {
  return (
    <Page>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Page>
  );
}

export default App;

const Page = styled.div``;

/*
font-family: 'Lato', sans-serif;
font-family: 'Oswald', sans-serif;
*/
