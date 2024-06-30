import Carousel from "../components/Carousel/Carousel"
import CountDown from "../components/CountDown/CountDown"
import Footer from "../components/Footer/Footer"
import Header from "../components/Header/Header"
import Location from "../components/Location/Location"
import { StyledLayout } from "./styleLayout"


export interface ILayoutProps {
}


const photos = [
    { src:"https://as2.ftcdn.net/v2/jpg/05/25/08/09/1000_F_525080936_JEpnKXh2siYKBPpsqd98pbbcIzy4ySKz.jpg"},
    { src:"https://as2.ftcdn.net/v2/jpg/05/25/08/09/1000_F_525080957_PA90qRfvuSwH4NQL2igf1QnbEm0203Si.jpg"},
    { src:"https://as2.ftcdn.net/v2/jpg/05/25/08/09/1000_F_525080945_zClwPD4MIQyoc25Y8vldqrwxZkiAZGtV.jpg"}, 
    { src:"https://as2.ftcdn.net/v2/jpg/05/25/08/09/1000_F_525080945_zClwPD4MIQyoc25Y8vldqrwxZkiAZGtV.jpg"},
    { src:"https://as2.ftcdn.net/v2/jpg/05/25/08/09/1000_F_525080945_zClwPD4MIQyoc25Y8vldqrwxZkiAZGtV.jpg"}
]

const Layout: React.FC<ILayoutProps> = () => {

    return (
        <StyledLayout >
            <Header/>
            <Carousel
                photos={photos}
                title="07 . 01 . 2025"
                subtitle=""
                />
            <CountDown/>
            <Location
                title="Location"
                leftText="Welcome to the left side"
                rightText="This is the right side"
                photos={photos}
                />
            <Footer/>
        </StyledLayout>
    )
}

export default Layout