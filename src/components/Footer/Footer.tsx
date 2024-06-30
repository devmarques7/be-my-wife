import { useTheme } from "@mui/material";
import Container from "../Container/Container"
import { Logo, NavLink, Rights, StyledFooter } from "./styleFooter";


export interface IFooterProps {
}

const Footer: React.FC<IFooterProps> = () => {
    const theme = useTheme();
    return (
        <Container id="#footer_page" size="medium" backgroundSrc={theme.palette.secondary.light}
            backgroundType="color">
            <StyledFooter theme={theme}>
                <div className="footer__nav">
                    <NavLink theme={theme} href="#home_page">Home</NavLink>
                    <NavLink theme={theme} href="#about_page">About</NavLink>
                    <NavLink theme={theme} href="#services_page">Services</NavLink>
                    <NavLink theme={theme} href="#contact_page">Contact</NavLink>
                </div>
                <Logo className="footer__logo">MyLogo</Logo>
                <Rights className="footer__rights">All rights reserved &copy; 2024 Daniel</Rights>
            </StyledFooter>
        </Container>
    )
}

export default Footer