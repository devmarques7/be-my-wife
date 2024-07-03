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
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: clamp(0.8rem, 2vw, 1.5rem);
`;

export const CountdownContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 60%;
  max-width: 600px;
  margin: 0 auto;
`;

export const StyledTimeSegment = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledNumber = styled.span`
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: clamp(3.3rem, 4vw, 6rem);
`;

export const StyledLabel = styled.span`
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: clamp(1rem, 2vw, 3.5rem) !important;
`;
