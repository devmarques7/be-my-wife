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
  photos: { src: string }[];
}

const Location: React.FC<ILocationProps> = ({ title, leftText, rightText, photos }) => {
  const theme = useTheme();

  return (
    <Container id="#location_page" backgroundSrc={theme.palette.background.default} backgroundType="color">
      <StyledLocation theme={theme}>
        <SideText theme={theme} className="location__side-text location__side-text--left">{leftText}</SideText>
        <div className="location__main-content">
          <Title theme={theme} className="location__title">{title}</Title>
          <PhotoContainer theme={theme} className="location__photo-container">
            <PhotoSlider photos={photos} />
          </PhotoContainer>
          <AppButton className="location__app_button" text="Visit Location"></AppButton>
        </div>
        <SideText theme={theme} className="location__side-text location__side-text--right">{rightText}</SideText>
      </StyledLocation>
    </Container>
  );
};

export default Location;
