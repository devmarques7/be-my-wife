import { useState, useContext } from "react";
import { useTheme, IconButton, Badge, Box } from "@mui/material";
import { StyledHeaderContainer, StyledLink, StyledNav, HamburgerIcon, MobileMenu } from "./styleHeader";
import { AppContext } from "../../context/AppContext";
import { useCart } from "../../context/CartContext";
import AppButton from "../AppButton/AppButton";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GlobalStyles from "../../style/styledGlobal";
import { Link } from "react-router-dom";

export interface IHeaderProps {}

const Header: React.FC<IHeaderProps> = () => {
  const theme = useTheme();
  const { webContent } = useContext(AppContext);
  const { cart, toggleCart } = useCart();
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
    if(index === 0){currentHref = "/"}
    if(index === 1){currentHref = "/#countdown_page"}
    if(index === 2){currentHref = "/#location_page"}
    if(index === 3){currentHref = "/presents"}

    return (
      <StyledLink
        key={link}
        theme={theme}
        as={Link}
        to={currentHref}
        onClick={() => setIsMenuOpen(false)}
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
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 0.5, sm: 1 },
          '& .MuiButton-root': {
            display: { xs: 'none', sm: 'inline-flex' }
          }
        }}>
          <IconButton
            onClick={toggleCart}
            sx={{ 
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}20`
              }
            }}
          >
            <Badge badgeContent={cart.itemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <AppButton text={TALK_TO_US.TEXT} navigateTo={TALK_TO_US.URL}/>
        </Box>
        {isMenuOpen && (
          <MobileMenu className={isMenuOpen ? 'open' : ''} theme={theme}>
            <div className="mobile-menu__header">
              <CloseIcon onClick={toggleMenu} />
            </div>
            <div className="mobile-menu__nav">
              {NAVBAR.map((link, index) => conditionalRender(link, index))}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mt: 2,
                gap: 2
              }}>
                <IconButton
                  onClick={() => {
                    toggleCart();
                    setIsMenuOpen(false);
                  }}
                  sx={{ 
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}20`
                    }
                  }}
                >
                  <Badge badgeContent={cart.itemCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <AppButton text={TALK_TO_US.TEXT} navigateTo={TALK_TO_US.URL}/>
              </Box>
            </div>
          </MobileMenu>
        )}
      </StyledHeaderContainer>
    </>
  );
}

export default Header;
