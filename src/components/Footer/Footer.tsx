import { useTheme } from "@mui/material";
import Container from "../Container/Container";
import { Logo, NavLink, Rights, StyledFooter, SocialIcons } from "./styleFooter";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export interface IFooterProps {
  SOCIAL_MEDIA: {
    INSTAGRAM: string;
    WHATSAPP: string;
}
copyright: string;
}

const Footer: React.FC<IFooterProps> = ({SOCIAL_MEDIA, copyright}) => {
  const theme = useTheme();
  const { webContent } = useContext(AppContext);
  const { NAVBAR } = webContent.HEADER;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const conditionalRender = (link: string, index:number) => {
    let currentHref = ""
    if(index === 0){currentHref = "home_page"}
    if(index === 1){currentHref = "countdown_page"}
    if(index === 2){currentHref = "location_page"}
    return (
      <NavLink
        key={link}
        theme={theme}
        href={`#${currentHref}`}
        onClick={(e) => {
          e.preventDefault(); // Prevent default link behavior
          scrollToSection(currentHref);
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
          {NAVBAR.map((link, index) => conditionalRender(link, index))}
        </div>
        <Logo className="footer__logo">Be My Wife</Logo>
        <SocialIcons>
          <a href={SOCIAL_MEDIA.INSTAGRAM} target="_blank" rel="noopener noreferrer">
            <InstagramIcon style={{ color: 'black' }} />
          </a>
          <a href={SOCIAL_MEDIA.WHATSAPP} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon style={{ color: 'black' }} />
          </a>
        </SocialIcons>
        <Rights theme={theme} className="footer__rights">{copyright}</Rights>
      </StyledFooter>
    </Container>
  );
};

export default Footer;
