import { useTheme } from "@mui/material";
import {  StyledBox, StyledLink, StyledNav } from "./styleHeader"
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import AppButton from "../AppButton/AppButton";

export interface IHeaderProps {
}

const Header: React.FC<IHeaderProps> = () => {
    const theme = useTheme();
    const { webContent } = useContext(AppContext);
    const { TITLE, NAVBAR } = webContent.HEADER;

    const conditionalRender = (link: string) => {
        switch (link) {
          case "Home":
            return (
              <StyledLink key={link} theme={theme} id="links" href={`#${link.toLocaleLowerCase()}_page`}>
                {`${link}.`}
              </StyledLink>
            );
          case "Countdown":
            return (
              <StyledLink key={link} theme={theme} id="links" href={`#${link.toLocaleLowerCase()}_page`}>
                {`${link}.`}
              </StyledLink>
            );
          case "Location":
            return (
              <StyledLink key={link} theme={theme} id="links" href={`#${link.toLocaleLowerCase()}_page`}>
                {`${link}.`}
              </StyledLink>
            );
        }
      };

    return (
        <StyledBox theme={theme}>
            <StyledNav>{NAVBAR.map((link) => conditionalRender(link))}</StyledNav>
            <h1>{TITLE}</h1>
            <AppButton ghost text="Talk to us" />
        </StyledBox>
    )
}

export default Header