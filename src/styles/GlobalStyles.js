import { createGlobalStyle } from "styled-components";

const GlobalStyle=createGlobalStyle`

*{
    box-sizing: border-box;
}
body{
    .ReactModal__Content{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 99999999;
        h2{
            font-family: Lato;
            font-size: 34px;
            font-weight: 700;
            text-align: center;
            color: #FFFFFF;
            width: 338px;
        }
        button{
            width: 134px;
            height: 37px;
            border-radius: 5px;
            border: none;
            margin-left: 50px;
            margin-top: 37px;
        }
        .back{
            background-color: #FFFFFF;
            color: #1877F2;
        }
        .delete{
            background-color: #1877F2;
            color: #FFFFFF;
        }
    }
    .ReactModal__Overlay{
        z-index: 99999;
    }
}
`;

export default GlobalStyle;