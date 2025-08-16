import styled, { css } from "styled-components";

interface IStyledContainer {
  $backgroundColor?: string;
  $backgroundImage?: string;
  $size: string;
  $personalizedWidth: string;
  $logoWidth: string;
  $logoMinWidth: string;
}

export const StyledContainer = styled.div<IStyledContainer>`
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;

  background-color: ${(props) => props.$backgroundColor || "transparent"};
  background-image: ${(props) => (props.$backgroundImage ? `url("${props.$backgroundImage}")` : "none")};

  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  width: 100vw; // Ajuste para garantir que o contêiner ocupe 100% da largura do viewport

  ${(props) => {
    switch (props.$size) {
      case "small":
        return css`
          height: 15vh;
        `;
      case "medium":
        return css`
          height: 30vh;
        `;
      case "big":
        return css`
          height: 87vh;
        `;
      default:
        return css`
          height: ${props.$size};
        `;
    }
  }}

  .logo {
    width: ${(props) => props.$logoWidth};
    min-width: ${(props) => props.$logoMinWidth};
    margin: 0 auto;
  }

  .video-background {
    object-fit: cover;
    height: 100%;
    width: 100vw;
  }

  .logo_video-background {
    position: absolute;
    z-index: 1;
  }

  .video-children {
    position: absolute;
    z-index: 5;
  }
`;
