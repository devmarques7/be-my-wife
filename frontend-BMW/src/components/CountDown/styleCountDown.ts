import styled from "styled-components";
import { Box } from "@mui/material";
import { Theme } from "@mui/material/styles";

interface StyledProps {
  theme: Theme;
  colorVariant: 'primary' | 'secondary';
}

const getColorFromVariant = (theme: Theme, colorVariant: 'primary' | 'secondary') => {
  return colorVariant === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main;
};

export const StyledCountDown = styled(Box)<StyledProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: ${({ theme }) => theme.palette.secondary.dark};
  background-color: ${({ theme, colorVariant }) => `${getColorFromVariant(theme, colorVariant)}10`}; // 50% opacity
  text-align: center;
`;

export const StyledTitle = styled.h1<StyledProps>`
  margin-bottom: 1rem;
  color: ${({ theme, colorVariant }) => getColorFromVariant(theme, colorVariant)};
  font-size: clamp(0.8rem, 2vw, 1.5rem);
`;

export const CountdownContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 60%;
  max-width: 600px;
  margin: 0 auto;
`;

export const StyledTimeSegment = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledNumber = styled.span<StyledProps>`
  color: ${({ theme, colorVariant }) => getColorFromVariant(theme, colorVariant)};
  font-size: clamp(3.3rem, 4vw, 6rem);
`;

export const StyledLabel = styled.span<StyledProps>`
  color: ${({ theme, colorVariant }) => getColorFromVariant(theme, colorVariant)};
  font-size: clamp(1rem, 2vw, 3.5rem) !important;
`;
