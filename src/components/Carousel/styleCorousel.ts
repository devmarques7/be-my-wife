import styled from "styled-components";
import { Theme } from "@mui/material/styles";

interface StyledThemeProps {
  theme: Theme;
}

export const StyledCarousel = styled.div<StyledThemeProps>`
  background-color: ${({ theme }) => theme.palette.background.default};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  margin-top: 80px; /* Separar do Header fixo */
  position: relative;
  overflow: hidden;

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
    height: 80%;
    padding: 2rem 0;
    position: relative;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .swiper-slide {
    width: 37rem;
    height: 42rem;
    position: relative;
    transition: transform 0.3s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .swiper-slide img {
    position: relative;
    width: 65%;
    height: 90%;
    border-radius: 0rem;
    object-fit: cover;
    max-width: 100%;
    max-height: 100%;

    @media (max-width: 480px) {
      height: 95%;
      width: 80%;
    }
  }

  .swiper-slide-active-text .text-box {
    opacity: 1;
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


  @media (max-width: 1075px) {
    .swiper_container {
      max-width: 90vw;
    }
    
    .swiper-slide {
      width: 30rem;
      height: 34rem;

      img{
        height: 80%;
        width: 70%;
      }
    }
  }

  @media (max-width: 768px) {
    .swiper_container {
      max-width: 95vw;
      height: 70%;
    }
    
    .swiper-slide {
      width: 28rem;
      height: 32rem;
      
      img {
        width: 75%;
        height: 85%;
      }
    }
  }

  @media (max-width: 480px) {
    .swiper_container {
      height: 60%;
      max-width: 98vw;
    }
    
    .swiper-slide {
      width: 25rem;
      height: 26rem;

      img{
        height: 95%;
        width: 80%;
      }
    }
  }

  @media (max-width: 380px) {
    .swiper_container {
      height: 55%;
    }
    
    .swiper-slide {
      width: 20rem;
      height: 25rem;
      
      img {
        width: 85%;
        height: 90%;
      }
    }
  } 
`;

export const StyledTitle = styled.h5<StyledThemeProps>`
  position: relative;
  text-align: center;
  z-index: 10;

  font-family: ${({ theme }) => theme.typography.h5.fontFamily} !important;
  color: ${({ theme }) => theme.palette.secondary.main};
  font-weight: 600;
  font-size: clamp(3.5rem, 12vw, 12rem);
  top: clamp(10rem, 2vw, 18rem);
  max-height:10px;

`;

export const StyledSubTitle = styled.h4<StyledThemeProps>`
  position: relative;
  text-align: center;
  left: 35%; /* Center horizontally */
  transform: translateX(-50%); /* Adjust for exact center */
  z-index: 10;

  font-family: ${({ theme }) => theme.typography.h4.fontFamily} !important;
  color: ${({ theme }) => theme.palette.secondary.main};
  font-weight: lighter;
  font-size: 1.5rem;

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
`;

export const StyledTextBox = styled.div<StyledThemeProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  bottom: clamp(0rem, 3vw, 1.8rem);;
  color: ${({ theme }) => theme.palette.secondary.main};

  width: 60%;
  max-width: 750px;
  min-width: 330px;
  text-align: center;
  padding: 1rem;

  font-size: clamp(0.8rem, 2vw, 1.5rem);


`;
