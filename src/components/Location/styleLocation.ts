import styled from "styled-components";
import { Box } from "@mui/material";

export const StyledLocation = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  text-align: center;
  position: relative;

  .location__main-content{
    display: flex;
    flex-direction: column;
    gap: 20px;

    .location__app_button{
      max-width: 110px;
      margin: 0 auto;
    }
  }
`;

export const SideText = styled.div`
  width: 20%;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &.location__side-text--left {
    background-color: ${({ theme }) => theme.palette.primary.main};
  }

  &.location__side-text--right {
    background-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const Title = styled.h1`
  position: relative;
  top: 110px;
  z-index: 10;
  font-size: 8rem;
  font-weight: lighter;
`;

export const PhotoContainer = styled.div`
  width: 100%;
  max-width: 37rem; // Maximum width of the photo
  margin: 0 auto;
`;
