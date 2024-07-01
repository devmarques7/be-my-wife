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
  position: relative;
  z-index: 20;

  @media (max-width: 768px) {
    padding: 0 20px;
  }

  .desktop-nav {
    @media (max-width: 768px) {
      display: none;
    }
  }
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
  cursor: pointer;
`;

export const HamburgerIcon = styled.div<{ isMenuOpen: boolean }>`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    opacity: ${({ isMenuOpen }) => (isMenuOpen ? '0%' : '100%')} ;
  }
`;

export const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => `${theme.palette.primary.main}90`}; // 50% opacity
  z-index: 20;
  padding: 20px;
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;

  &.open {
    transform: translateY(0);
    overflow-y: hidden;
  }

  .mobile-menu__header {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
  }

  .mobile-menu__nav {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    align-items: center;
  }
`;