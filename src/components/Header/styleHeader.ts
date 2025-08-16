import { Box, Link } from '@mui/material';
import styled from 'styled-components';
import { Theme } from '@mui/material/styles';

interface StyledThemeProps {
  theme: Theme;
}

// Estilize o componente StyledBox
export const StyledHeaderContainer = styled.header<StyledThemeProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 0 40px;
  background-color: ${({ theme }) => theme.palette.background.default};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0 20px;
  }

  .desktop-nav {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

// Estilize o componente StyledNav
export const StyledNav = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  gap: 20px;
`;

// Estilize o componente StyledLink
export const StyledLink = styled(Link)<StyledThemeProps>`
  font-size: ${({ theme }) => theme.typography.fontSize}px !important;
  color: ${({ theme }) => theme.palette.secondary.main} !important;
  cursor: pointer;
`;

// Estilize o componente HamburgerIcon e adicione a propriedade $isMenuOpen
export const HamburgerIcon = styled.div<{ $isMenuOpen: boolean }>`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: ${({ $isMenuOpen }) => ($isMenuOpen ? 'none' : 'flex')};
    align-items: center;
  }
`;

// Estilize o componente MobileMenu
export const MobileMenu = styled.div<StyledThemeProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => `${theme.palette.primary.main}80`}; // 50% opacity
  z-index: 20;
  padding: 20px;
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;

  &.open {
    transform: translateY(0);
  }

  .mobile-menu__header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }

  .mobile-menu__nav {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    align-items: center;
    height: calc(100% - 40px); // Ajuste para garantir que a navegação esteja centralizada verticalmente
  }
`;
