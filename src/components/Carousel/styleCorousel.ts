import styled from "styled-components";

export const StyledCarousel = styled.div`
  background-color: ${({ theme }) => theme.palette.background.default};

  html {
    font-size: 62.5%;
    scroll-behavior: smooth;
  }

  @media (min-width: 1440px) {
    html {
      zoom: 1.5;
    }
  }

  @media (min-width: 2560px) {
    html {
      zoom: 1.7;
    }
  }

  @media (min-width: 3860px) {
    html {
      zoom: 2.5;
    }
  }

  ::-webkit-scrollbar {
    width: 1.3rem;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 1rem;
    background: #797979;
    transition: all 0.5s ease-in-out;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #222224;
  }

  ::-webkit-scrollbar-track {
    background: #f9f9f9;
  }

  body {
    font-size: 1.6rem;
    background: var(--bg);
  }

  .container {
    max-width: 124rem;
    padding: 4rem 1rem;
    margin: 0 auto;
  }

  .heading {
    padding: 1rem 0;
    font-size: 3.5rem;
    text-align: center;
  }

  .swiper_container {
    height: 52rem;
    padding: 2rem 0;
    position: relative;
  }

  .swiper-slide {
    width: 32rem;
    height: 42rem;
    position: relative;
    min-width: 32rem;
    transition: transform 0.3s ease-in-out;
  }

  .swiper-slide img {
    width: 100%;
    height: 95%; // Adjust the height to make space for the text box
    border-radius: 0rem;
    object-fit: cover;
  }

  .text-box {
    height: 25%; // The remaining height for the text box
    text-align: center;
    padding: 1rem;
    border-radius: 0 0 2rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .swiper-slide-active-text .text-box {
    opacity: 1;
  }

  @media (max-width: 500px) {
    .swiper_container {
      height: 47rem;
    }
    .swiper-slide {
      width: 28rem !important;
      height: 36rem !important;
    }
    .swiper-slide img {
      width: 28rem !important;
      height: 36rem !important;
    }
  }

  .swiper-slide-shadow-left,
  .swiper-slide-shadow-right {
    display: none;
  }

  .swiper-pagination {
    position: relative;
    width: 15rem !important;
    bottom: 1rem;
  }

  .swiper-pagination .swiper-pagination-bullet {
    background: white;
    filter: drop-shadow(0px 8px 24px white);
  }

  .swiper-pagination .swiper-pagination-bullet-active {
    background: grey;
  }
`;


export const StyledTitle = styled.h5`
    position: absolute;
    text-align: center;

    left: 50%; /* Center horizontally */
    transform: translateX(-50%); /* Adjust for exact center */
    z-index: 10;

    font-family: ${({ theme }) => theme.typography.h5.fontFamily} !important;
    color: ${({ theme }) => theme.palette.secondary.main};
    font-weight: 600;
    font-size: 9rem;

    min-width: 70%;

    @media (min-width: 768px) {
      top: 16rem;
      min-width: 80%;
    }

    @media (min-width: 1024px) {
      top: 20rem;
    }

    @media (min-width: 1440px) {
      top: 20.5rem;
    }

    @media (min-width: 2560px) {
      top: 21rem;
    }

    @media (min-width: 3860px) {
      top: 24rem;
    }
`

export const StyledSubTitle = styled.h4`

    position: absolute;
    text-align: center;

    left: 35%; /* Center horizontally */
    transform: translateX(-50%); /* Adjust for exact center */
    z-index: 10;

    font-family: ${({ theme }) => theme.typography.h4.fontFamily} !important;
    color: ${({ theme }) => theme.palette.secondary.main};
    font-weight: lighter;
    font-size: 1.5rem;

    min-width: 80%;

    @media (min-width: 768px) {
      top: 22rem;
    }

    @media (min-width: 1024px) {
      top: 26rem;
    }

    @media (min-width: 1440px) {
      top: 26.5rem;
    }

    @media (min-width: 2560px) {
      top: 27rem;
    }

    @media (min-width: 3860px) {
      top: 30rem;
    }
`


