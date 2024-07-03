import { useState, useContext } from "react";
import { useTheme } from "@mui/material";
import { StyledHeaderContainer, StyledLink, StyledNav, HamburgerIcon, MobileMenu } from "./styleHeader";
import { AppContext } from "../../context/AppContext";
import AppButton from "../AppButton/AppButton";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import GlobalStyles from "../../style/styledGlobal";

export interface IHeaderProps {}

const Header: React.FC<IHeaderProps> = () => {
  const theme = useTheme();
  const { webContent } = useContext(AppContext);
  const { TITLE, NAVBAR, TALK_TO_US } = webContent.HEADER;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };

  const conditionalRender = (link: string) => {
    const id = `${link.toLowerCase()}_page`;
    return (
      <StyledLink
        key={link}
        theme={theme}
        id="links"
        href={`#${id}`}
        onClick={(e) => {
          e.preventDefault(); // Prevent default link behavior
          scrollToSection(id);
        }}
      >
        {link}
      </StyledLink>
    );
  };

  return (
    <>
      <GlobalStyles isMenuOpen={isMenuOpen} theme={theme}/>
      <StyledHeaderContainer theme={theme}>
        <HamburgerIcon $isMenuOpen={isMenuOpen} onClick={toggleMenu}>
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </HamburgerIcon>
        <StyledNav className="desktop-nav">{NAVBAR.map((link) => conditionalRender(link))}</StyledNav>
        <h1>{TITLE}</h1>
        <AppButton ghost text={TALK_TO_US.TEXT} navigateTo={TALK_TO_US.URL}/>
        {isMenuOpen && (
          <MobileMenu className={isMenuOpen ? 'open' : ''} theme={theme}>
            <div className="mobile-menu__header">
              <CloseIcon onClick={toggleMenu} />
            </div>
            <div className="mobile-menu__nav">
              {NAVBAR.map((link) => conditionalRender(link))}
            </div>
          </MobileMenu>
        )}
      </StyledHeaderContainer>
    </>
  );
}

export default Header;
