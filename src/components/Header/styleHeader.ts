import { Box, Link } from '@mui/material';
import styled from 'styled-components';

export const StyledBox = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 80px;

  padding: 0 40px;

  background-color: ${({ theme }) => theme.palette.background.default};
`;

export const StyledNav = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: fit-content;

  gap: 20px;
`;

export const StyledLink = styled(Link)`
    font-size: ${({ theme }) => theme.typography.p.fontSize}px !important;
    color: ${({ theme }) => theme.palette.secondary.main} !important;
`;