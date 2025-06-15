import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "@mui/material";
import { StyledAppButton } from "./styleAppButton";

export interface IAppButtonProps {
  text: string;
  className?: string;
  type?: "primary" | "dashed";
  navigateTo?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const AppButton: React.FC<IAppButtonProps> = ({ 
  text, 
  className, 
  type = "primary", 
  navigateTo, 
  onClick, 
  disabled 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    
    if (navigateTo) {
      navigate(navigateTo);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <StyledAppButton
      theme={theme}
      className={className}
      type={type}
      onClick={handleClick}
      disabled={disabled}
    >
      {text}
    </StyledAppButton>
  );
};

export default AppButton;
