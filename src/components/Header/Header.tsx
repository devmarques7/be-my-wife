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

  // Alterna o estado do menu (aberto/fechado)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Função para rolar suavemente para a seção desejada
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false); // Fecha o menu após a navegação
  };

  // Renderiza condicionalmente os links de navegação
  const conditionalRender = (link: string, index: number) => {
    let currentHref = ""
    if(index === 0){currentHref = "home_page"}
    if(index === 1){currentHref = "countdown_page"}
    if(index === 2){currentHref = "location_page"}

    return (
      <StyledLink
        key={link}
        theme={theme}
        href={`#${currentHref}`}
        onClick={(e) => {
          e.preventDefault(); // Previne o comportamento padrão do link
          scrollToSection(currentHref); // Chama a função de rolagem com o ID correto
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
        <StyledNav className="desktop-nav">{NAVBAR.map((link, index) => conditionalRender(link, index))}</StyledNav>
        <h1>{TITLE}</h1>
        <AppButton ghost text={TALK_TO_US.TEXT} navigateTo={TALK_TO_US.URL}/>
        {isMenuOpen && (
          <MobileMenu className={isMenuOpen ? 'open' : ''} theme={theme}>
            <div className="mobile-menu__header">
              <CloseIcon onClick={toggleMenu} />
            </div>
            <div className="mobile-menu__nav">
              {NAVBAR.map((link, index) => conditionalRender(link, index))}
            </div>
          </MobileMenu>
        )}
      </StyledHeaderContainer>
    </>
  );
}

export default Header;
