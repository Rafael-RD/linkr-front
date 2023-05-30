import styled from "styled-components";

export default function Banner() {
  return (
    <BannerStyle>
      <section>
        <h1>linkr</h1>
        <h2>save, share and discover the best links on the web</h2>
      </section>
    </BannerStyle>
  );
}

const BannerStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #151515;
  width: 63%;
  min-width: 63%;
  height: 100%;
  > section {
    width: 49%;
    h1 {
      font-family: "Passion One";
      font-style: normal;
      font-weight: 700;
      font-size: 106px;
      line-height: 117px;
      letter-spacing: 0.05em;
      color: #ffffff;
    }
    h2 {
      font-family: "Oswald";
      font-style: normal;
      font-weight: 700;
      font-size: 43px;
      line-height: 64px;
      color: #ffffff;
    }
  }
`;
