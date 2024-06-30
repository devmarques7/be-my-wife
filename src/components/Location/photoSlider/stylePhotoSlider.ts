import styled from "styled-components";

export const StyledPhotoSlider = styled.div`
  .swiper-container {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    max-width: 100%;
    width: 100%; // Ensure image takes full width of the container
    max-width: 37rem; // Maximum width of the image
    object-fit: cover;
  }
`;
