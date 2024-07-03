import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import { StyledCarousel, StyledSubTitle, StyledTitle, StyledTextBox } from "./styleCorousel";
import { ICarousel } from "../../interfaces/ICarousel";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";

const Carousel = ({ photos, title, subtitle }: ICarousel) => {
  const theme = useTheme();
  const slidesPerView = Math.min(photos.length, 2);

  // Função para calcular o spaceBetween baseado no tamanho da tela
  const calculateSpaceBetween = () => {
    if (window.innerWidth >= 1500) return 380;
    if (window.innerWidth >= 1200) return 200;
    if (window.innerWidth >= 768) return 50;
    if (window.innerWidth >= 468) return 10;
    return "auto";
  };

  const [spaceBetween, setSpaceBetween] = useState(calculateSpaceBetween());

  useEffect(() => {
    console.log(spaceBetween)
    const handleResize = () => {
      setSpaceBetween(calculateSpaceBetween());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <StyledCarousel id="home_page" theme={theme}>
      {title && <StyledTitle className="title" theme={theme}>{title}</StyledTitle>}
      {subtitle && <StyledSubTitle theme={theme}>{subtitle}</StyledSubTitle>}
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        autoplay={{ delay: 5000 }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="swiper_container"
        onSlideChange={(swiper) => {
          document.querySelectorAll('.swiper-slide').forEach((slide) => {
            slide.classList.remove('swiper-slide-active-text');
          });
          swiper.slides[swiper.activeIndex].classList.add('swiper-slide-active-text');
        }}
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index} style={{ width: '25rem', minWidth: "25rem" }}>
            <a className="tag_slide_image" rel="noopener noreferrer">
              <img src={photo.src} alt="slide_image" />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
      <StyledTextBox theme={theme}>
        <p>{photos.length > 0 && photos[0].description}</p>
      </StyledTextBox>
    </StyledCarousel>
  );
};

export default Carousel;
