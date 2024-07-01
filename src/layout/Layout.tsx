import Carousel from "../components/Carousel/Carousel"
import CountDown from "../components/CountDown/CountDown"
import Footer from "../components/Footer/Footer"
import Header from "../components/Header/Header"
import Location from "../components/Location/Location"
import { StyledLayout } from "./styleLayout"


export interface ILayoutProps {
}


const carousel = [
    { 
      src: "/source/g&d3.jpg", 
      description: "Cherishing every moment with you, my love. Here's to many more beautiful memories together."
    },
    { 
      src: "/source/g&d8.jpg", 
      description: "In your arms, I found my home. Every day with you is a new adventure, full of love and joy."
    },
    { 
      src: "/source/g&d4.jpg", 
      description: "Two hearts, one soul. Our love story is my favorite, and I'm grateful for every chapter we write together."
    },
    { 
      src: "/source/g&d5.jpg", 
      description: "Together we laugh, together we dream. With you by my side, life's journey is the sweetest."
    },
    { 
      src: "/source/g&d6.jpg", 
      description: "In every moment we share, love grows stronger. With you, every day feels like a beautiful adventure."
    }
  ];

  const location = [
    { 
      src: "/source/villa.jpg"
    },
    { 
      src: "/source/villa2.jpg"
    },
    { 
      src: "/source/villa4.jpg"
    }
  ];

const Layout: React.FC<ILayoutProps> = () => {

    return (
        <StyledLayout >
            <Header/>
            <Carousel
                photos={carousel}
                title="07 . 01 . 2025"
                subtitle=""
                />
            <CountDown/>
            <Location
                title="Location"
                leftText="Villa Vezanne - Where our dream will become reality ..."
                rightText="R. Benedito Fontana, 510 - Mairiporã, SP, 07627-200"
                url="https://www.instagram.com/villavezzane/"
                photos={location}
                />
            <Footer/>
        </StyledLayout>
    )
}

export default Layout