import styled from "styled-components";

export default function TrendingList() {
  return (
    <TrendingListStyle>
      <h4>trending</h4>
      <ul>
        <li>
          <span># oi</span>
        </li>
        <li># oi</li>
        <li>
          <span># oioioioioioioioioioioioioioioioioioioioioioioioioioi</span>
        </li>
        <li>
          <span># oi</span>
        </li>
        <li>
          <span># oi</span>
        </li>
        <li>
          <span># oi</span>
        </li>
        <li>
          <span># oi</span>
        </li>
        <li>
          <span># oi</span>
        </li>
        <li>
          <span># oi</span>
        </li>
        <li>
          <span># oi</span>
        </li>
      </ul>
    </TrendingListStyle>
  );
}

const TrendingListStyle = styled.div`
  background: #171717;
  width: 301px;
  border-radius: 16px;

  h4 {
    padding: 9px 16px 12px;
    font-family: "Oswald", sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 27px;
    line-height: 40px;
    color: #ffffff;
  }
  ul {
    padding: 22px 16px 30px;
    border-top: 1px solid #484848;
    display: flex;
    flex-direction: column;
    gap: 3px;
    max-width: 100%;
    overflow: hidden;
    li {
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      max-width: 100%;
      font-family: "Lato", sans-serif;
      font-style: normal;
      font-weight: 700;
      font-size: 19px;
      line-height: 23px;
      letter-spacing: 0.05em;
      color: #ffffff;

      display: flex;
    }
  }
`;
