import styled from 'styled-components';
import { Box } from '@mui/material';

export const StyledLogin = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;

  .login-form {
    max-width: 400px;
    width: 100%;
    padding: 2rem;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`; 