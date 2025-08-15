import styled from "styled-components";
import { Box } from "@mui/material";

export const StyledCompactCountDown = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => `${theme.palette.primary.main}20`};
  border-radius: 0.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
`; 