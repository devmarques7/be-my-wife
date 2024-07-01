import styled from "styled-components";
import { Box } from "@mui/material";

export const StyledCountDown = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: ${({ theme }) => theme.palette.secondary.main};
  background-color: ${({ theme }) => `${theme.palette.secondary.main}80`}; // 50% opacity
  text-align: center;
`;

export const StyledTitle = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.palette.primary.main};
  @media (max-width: 768px) {
    font-size: 4rem;
  }

  @media (min-width: 768px) {
    font-size: 4rem;
  }

  @media (min-width: 1024px) {
    font-size: 8rem;
  }

  @media (min-width: 1440px) {
    font-size: 8.5rem;
  }

  @media (min-width: 2560px) {
    font-size: 9rem;
  }

  @media (min-width: 3860px) {
    font-size: 11rem;
  }
`;

export const CountdownContainer = styled.div`
  display: flex;
  gap: 8rem;
`;

export const StyledTimeSegment = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledNumber = styled.span`
  font-size: 3.5rem;
  color: ${({ theme }) => theme.palette.primary.main};
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (min-width: 768px) {
    font-size: 4rem;
  }

  @media (min-width: 1024px) {
    font-size: 6rem;
  }

  @media (min-width: 1440px) {
    font-size: 6.5rem;
  }

  @media (min-width: 2560px) {
    font-size: 7rem;
  }

  @media (min-width: 3860px) {
    font-size: 9rem;
  }
`;

export const StyledLabel = styled.span`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.palette.primary.main};
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (min-width: 768px) {
    font-size: 2rem;
  }

  @media (min-width: 1024px) {
    font-size: 2rem;
  }

  @media (min-width: 1440px) {
    font-size: 2.5rem;
  }

  @media (min-width: 2560px) {
    font-size: 3rem;
  }

  @media (min-width: 3860px) {
    font-size: 6rem;
  }
`;
