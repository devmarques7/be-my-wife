import styled from "styled-components";
import { Box } from "@mui/material";

export const StyledCountDown = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: ${({ theme }) => theme.palette.secondary.main};
  text-align: center;
`;

export const StyledTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const CountdownContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

export const StyledTimeSegment = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledNumber = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const StyledLabel = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;
