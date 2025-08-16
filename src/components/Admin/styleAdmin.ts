import styled from 'styled-components';
import { Box } from '@mui/material';
import { Theme } from '@mui/material/styles';

interface StyledAdminProps {
  theme: Theme;
}

export const StyledAdmin = styled(Box)<StyledAdminProps>`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.palette.background.default};

  .statistics-card {
    background-color: ${({ theme }) => theme.palette.background.paper};
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .chart-container {
    background-color: ${({ theme }) => theme.palette.background.paper};
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 2rem;
  }
`; 