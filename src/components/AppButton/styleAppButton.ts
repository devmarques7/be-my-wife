import styled from 'styled-components';
import { Theme } from '@mui/material/styles';

export interface IAppButtonProps {
  type?: "primary" | "dashed" | "default";
  navigateTo?: string;
  disabled?: boolean;
}

interface StyledAppButtonProps {
  type: 'primary' | 'dashed';
  disabled?: boolean;
  fullWidth?: boolean;
  theme: Theme;
}

export const StyledAppButton = styled.button<StyledAppButtonProps>`
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  font-family: ${props => props.theme.typography.fontFamily};
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  ${props => props.type === 'primary' && `
    background-color: ${props.theme.palette.secondary.main};
    color: ${props.theme.palette.secondary.light};
    border: none;

    &:hover {
      background-color: ${props.disabled 
        ? props.theme.palette.primary.light 
        : props.theme.palette.primary.dark};
    }
  `}

  ${props => props.type === 'dashed' && `
    background-color: transparent;
    color: ${props.theme.palette.secondary.main};
    border: 2px dashed ${props.theme.palette.secondary.main};

    &:hover {
      background-color: ${props.disabled 
        ? 'transparent' 
        : props.theme.palette.secondary.light};
    }
  `}
`;