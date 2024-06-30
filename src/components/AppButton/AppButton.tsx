import { useTheme } from "@mui/material";
import { StyledAppButton } from "./styleAppButton";



export interface IAppButtonProps {
  text:string
  className?:string
  type?: "primary" | "dashed" 
  ghost?: boolean | undefined
}

const AppButton: React.FC<IAppButtonProps> = ({text, className, type, ghost}) => {
    const theme = useTheme();
    
    return (<StyledAppButton theme={theme} className={className} ghost={ghost} type={type}>{text}</StyledAppButton>)
}

export default AppButton