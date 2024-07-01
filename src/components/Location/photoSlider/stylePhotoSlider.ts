import styled from "styled-components";

export const StyledPhotoSlider = styled.div`
  .swiper-container {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 90%;
    max-width: 80vw;
    min-height: 47vh;
    object-fit: cover;

    @media (min-width: 768px) {
      width: 80%;
      max-width: 60vw;
    }

    @media (min-width: 1024px) {
      width: 75%;
      max-width: 55vw;
    }

    @media (min-width: 1440px) {
      width: 70%;
      max-width: 50vw;
    }

    @media (min-width: 2560px) {
      width: 65%;
      max-width: 45vw;
    }

    @media (min-width: 3860px) {
      width: 60%;
      max-width: 40vw;
    }
  }
`;
