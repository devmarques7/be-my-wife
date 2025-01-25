import React from "react";
import { useTheme } from "@mui/material";
import Container from "../../components/Container/Container";
import { StyledLocation, SideText, Title, PhotoContainer } from "./styleLocation";
import PhotoSlider from "./photoSlider/photoSlider";
import AppButton from "../AppButton/AppButton";

export interface ILocationProps {
  title: string;
  leftText: string;
  rightText: string;
  url: string;
  PHOTOS_LOCATION: {
    SRC: string;
  }[]
  BUTTON_ACTION: string;
}

const Location: React.FC<ILocationProps> = ({ title, leftText, rightText, PHOTOS_LOCATION, url, BUTTON_ACTION }) => {
  const theme = useTheme();

  return (
    <Container id="location_page" backgroundSrc={theme.palette.background.default} backgroundType="color">
      <StyledLocation theme={theme}>
        <SideText theme={theme} className="location__side-text location__side-text--left">{leftText}</SideText>
        <div className="location__main-content">
          <Title theme={theme} className="location__title">{title}</Title>
          <PhotoContainer theme={theme} className="location__photo-container">
            <PhotoSlider PHOTOS_LOCATION={PHOTOS_LOCATION} />
          </PhotoContainer>
          <AppButton className="location__app_button" text={BUTTON_ACTION} navigateTo={url}></AppButton>
        </div>
        <SideText theme={theme} className="location__side-text location__side-text--right">{rightText}</SideText>
      </StyledLocation>
    </Container>
  );
};

export default Location;