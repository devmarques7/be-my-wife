import React from "react";
import { useTheme } from "@mui/material";
import { StyledLabel, StyledNumber, StyledTimeSegment } from "../styleCountDown";

export interface TimeSegmentProps {
  value: number;
  label: string;
  colorVariant: 'primary' | 'secondary';
}

const TimeSegment: React.FC<TimeSegmentProps> = ({ value, label, colorVariant }) => {
  const theme = useTheme();
  return (
    <StyledTimeSegment colorVariant={colorVariant} theme={theme}>
      <StyledNumber colorVariant={colorVariant} theme={theme}>{value}</StyledNumber>
      <StyledLabel colorVariant={colorVariant} theme={theme}>{label}</StyledLabel>
    </StyledTimeSegment>
  );
};

export default TimeSegment;
