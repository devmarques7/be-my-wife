import { useTheme } from "@mui/material";
import Container from "../../components/Container/Container"
import { StyledBox } from "./styleHome"

export interface IHomeProps {
}

const Home: React.FC<IHomeProps> = () => {
    const theme = useTheme();
    return (
        <Container id="#home_page" backgroundSrc={theme.palette.background.default}
            backgroundType="color">
            <StyledBox>
                <h1>Welcome to My Website</h1>
                <p>This is a personalized website template.</p>
            </StyledBox>
        </Container>
    )
}

export default Home