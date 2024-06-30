import React from "react";
import { useTheme } from "@mui/material";
import { StyledLabel, StyledNumber, StyledTimeSegment } from "../styleCountDown";

interface TimeSegmentProps {
  value: number;
  label: string;
}

const TimeSegment: React.FC<TimeSegmentProps> = ({ value, label }) => {
  const theme = useTheme();
  return (
    <StyledTimeSegment theme={theme}>
      <StyledNumber theme={theme}>{value}</StyledNumber>
      <StyledLabel theme={theme}>{label}</StyledLabel>
    </StyledTimeSegment>
  );
};

export default TimeSegment;
