import { useTheme } from "@mui/material";
import { StyledAppButton } from "./styleAppButton";

export interface IAppButtonProps {
  text: string;
  className?: string;
  type?: "primary" | "dashed";
  navigateTo?: string;
  ghost?: boolean | undefined;
}

const AppButton: React.FC<IAppButtonProps> = ({ text, className, type, navigateTo, ghost }) => {
  const theme = useTheme();

  const handleClick = () => {
    console.log(navigateTo)
    if (navigateTo) {
      window.open(navigateTo, '_blank');
    }
  };

  return (
    <StyledAppButton
      theme={theme}
      className={className}
      ghost={ghost}
      type={type}
      onClick={handleClick}
    >
      {text}
    </StyledAppButton>
  );
};

export default AppButton;
