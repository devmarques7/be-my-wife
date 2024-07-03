import styled from "styled-components";
import { Box } from "@mui/material";

export const StyledLocation = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  position: relative;
  background-color: ${({ theme }) => theme.palette.primary.main};
  padding: 0 20px;

  .location__main-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100%;
    gap: 20px;

    .location__app_button {
      max-width: 110px;
    }
  }
`;

export const SideText = styled.div`
  position: absolute;
  top: 5%;

  z-index: 10;
  width: 20%;
  font-size: clamp(0.8rem, 1.5vw, 2.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.primary.main};

  &.location__side-text--left{
    left: 10px;
    top: 40%;

  }

  &.location__side-text--right{
    right: 10px;
    top: 40%;

  }
`;

export const Title = styled.h1`
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  font-weight: lighter;

  font-size: clamp(4rem, 10vw, 6rem);

/* 
  @media (min-width: 768px) {
    font-size: 7rem;
    top: 4rem;
  }

  @media (min-width: 1024px) {
    font-size: 7rem;
    top: 4rem;
  }

  @media (min-width: 1440px) {
    font-size: 8rem;
    top: 0rem;
  }

  @media (min-width: 2560px) {
    font-size: 6rem;
    top: 7rem;
  }

  @media (min-width: 3860px) {
    font-size: 7rem;
    top: 11rem;
  } */
`;

export const PhotoContainer = styled.div`
  width: 100%;
  max-width: 37rem;
  margin: 0 auto;

  .swiper-horizontal {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

  @media (max-width: 768px) {
    width: 30%;
    img{
      min-height: 20rem !important;
    }
  }

  @media (min-width: 768px) {
    width: 60%;
  }

  @media (min-width: 1024px) {
    width: 70%;
  }

  @media (min-width: 2560px) {
    width: 90%;
  }


`;
