import styled from "styled-components";
import { Box } from "@mui/material";

export const StyledFooter = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.palette.text.primary};

  .footer__nav {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .footer__logo {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  .footer__rights {
    font-size: 1rem;
  }
`;

export const NavLink = styled.a`
  color: ${({ theme }) => theme.palette.text.primary};
  text-decoration: none;
  font-size: 1.2rem;

  &:hover {
    text-decoration: underline;
  }
`;

export const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

export const Rights = styled.div`
  font-size: 1rem;
`;
