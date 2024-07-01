import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import {StyledCarousel, StyledSubTitle, StyledTitle} from "./styleCorousel";
import { ICarousel } from "../../interfaces/ICarousel";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { useTheme } from "@mui/material";

const Carousel = ({ photos, title, subtitle }: ICarousel) => {
  const theme = useTheme();
    const slidesPerView = Math.min(photos.length, 2); 
  return (
    <StyledCarousel id="home_page"  theme={theme}>
      <div className="container">
        {title && <StyledTitle className="title" theme={theme} >{title}</StyledTitle>}
        {subtitle && <StyledSubTitle theme={theme} >{subtitle}</StyledSubTitle>}
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={slidesPerView} // Maintain auto width of slides
          spaceBetween={340} // Increase space between slides
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
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
              <div className="text-box">
                <p>{photo.description}</p>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-pagination"></div>
        </Swiper>
      </div>
    </StyledCarousel>
  );
};

export default Carousel;
