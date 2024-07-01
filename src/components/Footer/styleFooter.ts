import { Box, Link } from '@mui/material';
import styled from 'styled-components';

export const StyledFooter = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.palette.secondary.light};
  text-align: center;

  .footer__nav {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .footer__logo {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .footer__rights {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

export const NavLink = styled(Link)`
  font-size: ${({ theme }) => theme.typography.p.fontSize}px !important;
  color: ${({ theme }) => theme.palette.text.primary} !important;
  cursor: pointer;

  text-decoration: none !important;

  &:hover {
    text-decoration: underline !important;
  }
`;

export const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const Rights = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const SocialIcons = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;

  a {
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    font-size: 2rem;
  }
`;
