import { useTheme } from "@mui/material";
import Container from "../Container/Container";
import { Logo, NavLink, Rights, StyledFooter, SocialIcons } from "./styleFooter";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export interface IFooterProps {}

const Footer: React.FC<IFooterProps> = () => {
  const theme = useTheme();
  const { webContent } = useContext(AppContext);
  const { NAVBAR } = webContent.HEADER;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const conditionalRender = (link: string) => {
    const id = `${link.toLowerCase()}_page`;
    return (
      <NavLink
        key={link}
        theme={theme}
        href={`#${id}`}
        onClick={(e) => {
          e.preventDefault(); // Prevent default link behavior
          scrollToSection(id);
        }}
      >
        {link}
      </NavLink>
    );
  };

  return (
    <Container
      id="footer_page"
      size="medium"
      backgroundSrc={theme.palette.secondary.light}
      backgroundType="color"
    >
      <StyledFooter theme={theme}>
        <div className="footer__nav">
          {NAVBAR.map((link) => conditionalRender(link))}
        </div>
        <Logo className="footer__logo">Be My Wife</Logo>
        <SocialIcons>
          <a href="https://www.instagram.com/danieegaby_/" target="_blank" rel="noopener noreferrer">
            <InstagramIcon style={{ color: 'black' }} />
          </a>
          <a href="https://wa.me/message/DWXD446BLNVLH1" target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon style={{ color: 'black' }} />
          </a>
        </SocialIcons>
        <Rights theme={theme} className="footer__rights">All rights reserved &copy; 2024 Dany & Gaby</Rights>
      </StyledFooter>
    </Container>
  );
};

export default Footer;
