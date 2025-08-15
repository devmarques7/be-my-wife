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

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 1rem;
  }

  .admin-login {
    color: ${({ theme }) => theme.palette.primary.main};
    text-decoration: none;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
    border-radius: 0.5rem;
    transition: all 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.palette.primary.main};
      color: white;
    }
  }
`;

export const NavLink = styled(Link)`
  font-size: clamp(0.8rem, 1.5vw, 2.5rem) !important;
  color: ${({ theme }) => theme.palette.text.primary} !important;
  cursor: pointer;

  text-decoration: none !important;

  &:hover {
    text-decoration: underline !important;
  }
`;

export const Logo = styled.div`
  font-size: clamp(1.5rem, 2vw, 6rem) !important;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const Rights = styled.div`
  font-size: clamp(0.5rem, 1vw, 3rem) !important;
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
    font-size: clamp(1.5rem, 2vw, 6rem) !important;
  }
`;
