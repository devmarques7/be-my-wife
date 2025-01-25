import { useContext } from "react"
import Carousel from "../components/Carousel/Carousel"
import CountDown from "../components/CountDown/CountDown"
import Footer from "../components/Footer/Footer"
import Header from "../components/Header/Header"
import Location from "../components/Location/Location"
import Privacy from "../components/Privacy Policy/privacyPolicy"
import { AppContext } from "../context/AppContext"
import { StyledLayout } from "./styleLayout"


export interface ILayoutProps {
}



const Layout: React.FC<ILayoutProps> = () => {
  const { webContent } = useContext(AppContext);
  const { PHOTOS_CAROUSEL, TITLE_CAROUSEL } = webContent.CAROUSEL;
  const { PHOTOS_LOCATION, TITLE_LOCATION, LEFT_TEXT, RIGHT_TEXT, URL_LOCATION, BUTTON_ACTION } = webContent.LOCATION;
  const { TITLE_COUNTDOWN, DATETIME_COUNTDOWN, TIME_FIELDS } = webContent.COUNTDOWN;
  const { SOCIAL_MEDIA, COPYRIGHT } = webContent.FOOTER;

    return (
        <StyledLayout >
            <Privacy/>
            <Header/>
            <Carousel
                CONFIRME_PRESENCE={webContent.CONFIRME_PRESENCE}
                PHOTOS_CAROUSEL={PHOTOS_CAROUSEL}
                title={TITLE_CAROUSEL}
                subtitle=""
                />
            <CountDown title={TITLE_COUNTDOWN} datetime={DATETIME_COUNTDOWN} time_fields={TIME_FIELDS}/>
            <Location
                title={TITLE_LOCATION}
                leftText={LEFT_TEXT}
                rightText={RIGHT_TEXT}
                url={URL_LOCATION}
                PHOTOS_LOCATION={PHOTOS_LOCATION}
                BUTTON_ACTION={BUTTON_ACTION}
                />
            <Footer SOCIAL_MEDIA={SOCIAL_MEDIA} copyright={COPYRIGHT}  />
        </StyledLayout>
    )
}

export default Layout