import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { StyledPhotoSlider } from "./stylePhotoSlider";

interface PhotoSliderProps {
  PHOTOS_LOCATION: {
    SRC: string;
}[]
}

const PhotoSlider: React.FC<PhotoSliderProps> = ({ PHOTOS_LOCATION }) => {
  return (
    <StyledPhotoSlider>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }}
        modules={[Autoplay]}
      >
        {PHOTOS_LOCATION.map((photo, index) => (
          <SwiperSlide key={index}>
            <img src={photo.SRC} alt={`slide_${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </StyledPhotoSlider>
  );
};

export default PhotoSlider;
