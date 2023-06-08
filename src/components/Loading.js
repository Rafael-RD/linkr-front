import { ColorRing } from "react-loader-spinner";
import styled from "styled-components";

export default function Loading() {


    return (
        <LoadingContainer className="load">
            <ColorRing
                visible={true}
                height="60"
                width="60"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={['#6D6D6D', '#6D6D6D', '#6D6D6D', '#6D6D6D', '#6D6D6D']}
            />
            <span data-test="message">Loading more posts...</span>
        </LoadingContainer>
    )
}

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;

    svg{
        color: black;
    }

    >span{
        font-family: 'Lato', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 22px;
        color: #6D6D6D;
    }
`