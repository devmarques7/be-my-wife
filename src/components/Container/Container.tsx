import { useTheme } from "@mui/material";
import { StyledContainer } from "./styleContainer";
import { ReactNode, HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  backgroundType?: "image" | "color" | "video";
  size?: "small" | "medium" | "big" | string;
  personalizedWidth?: string;
  backgroundSrc?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logo?: any;
  id?: string;
  logoWidth?: string;
  logoMinWidth?: string;
  children?: ReactNode;
}

const Container = ({
  backgroundType,
  backgroundSrc = "#0000",
  logo,
  size = "big",
  personalizedWidth = "100vw",
  id,
  logoWidth = "30%",
  logoMinWidth = "300px",
  children,
  ...restProps
}: ContainerProps) => {
  const theme = useTheme();

  return (
    <StyledContainer
      theme={theme}
      $backgroundColor={backgroundType === "color" ? backgroundSrc : undefined}
      $backgroundImage={backgroundType === "image" ? backgroundSrc : undefined}
      $size={size}
      $personalizedWidth={personalizedWidth}
      id={id}
      $logoWidth={logoWidth}
      $logoMinWidth={logoMinWidth}
      {...restProps}
    >
      {backgroundType === "image" && logo && <img className="logo" src={logo} alt="logo image" />}
      {backgroundType === "video" && (
        <>
          <video className="video-background" autoPlay muted loop>
            <source src={backgroundSrc} />
          </video>
          {logo && <img className="logo logo_video-background" src={logo} alt="logo image" />}
          {children && <div className="video-children">{children}</div>}
        </>
      )}
      {backgroundType === "color" && logo && <img className="logo" src={logo} alt="logo image" />}
      {!backgroundType && logo && <img className="logo" src={logo} alt="logo image" />}
      {children}
    </StyledContainer>
  );
};

export default Container;
