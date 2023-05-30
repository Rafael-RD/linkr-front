import styled from "styled-components"

export default function Header(){

    return (
        <MyHeader>

        </MyHeader>
    )
}

const MyHeader=styled.header`
    display: flex;
    height: 100px;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    left: 0;
    background-color: red;
`;