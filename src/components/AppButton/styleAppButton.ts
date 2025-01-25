import { Button, ButtonProps } from 'antd';
import styled from 'styled-components';

export interface IAppButtonProps extends ButtonProps {
  type?: "primary" | "dashed" | "default";
  navigateTo?: string;
}

export const StyledAppButton = styled(Button)<IAppButtonProps>`
  border: ${({ theme, type }) =>
    type === "dashed"
      ? `1px dashed ${theme.palette.secondary.main}`
      : `1px solid ${theme.palette.secondary.main}`} !important;

  color: ${({ theme, type }) =>
    type === "primary" ? "#fff" : theme.palette.secondary.main} !important;

  background-color: ${({ theme, type }) =>
    type === "primary" ? theme.palette.secondary.main : "transparent"} !important;

  position: relative;
  overflow: hidden;

  &:hover {
    ${({ type, theme }) =>
      type === "primary"
        ? `
          background-color: transparent !important;
          color: ${theme.palette.secondary.main} !important;
        `
        : type === "dashed"
        ? `
          border-color: ${theme.palette.secondary.main};
        `
        : `
          background-color: transparent;
        `}
  }

  &:hover:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${({ theme, type }) =>
      type === "primary" ? theme.palette.secondary.main : "transparent"};
    z-index: -1;
    transition: left 5s ease-in-out;
  }

  &:hover:before {
    left: 0;
  }

  span {
    font-family: ${({ theme }) => theme.typography.p.fontFamily} !important;
  }
`;