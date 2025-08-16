import styled from "styled-components";
import { Box } from "@mui/material";
import { Theme } from "@mui/material/styles";

interface StyledCompactCountDownProps {
  theme: Theme;
  textColor: 'dark' | 'white';
}

export const StyledCompactCountDown = styled(Box)<StyledCompactCountDownProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => `${theme.palette.primary.main}20`};
  border-radius: 0.5rem;
  margin: 2rem auto;
  max-width: 100%;
  width: 100%;
  color: ${({ theme, textColor }) => 
    textColor === 'white' 
      ? theme.palette.common.white 
      : theme.palette.text.primary
  };

  /* Responsividade para mobile */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    margin: 1rem auto;
  }

  @media (max-width: 480px) {
    gap: 0.25rem;
    padding: 0.5rem;
    margin: 0.75rem auto;
  }

  /* Garantir que os elementos filhos sejam responsivos */
  & > * {
    flex-shrink: 0;
  }
`; 