import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material";

import TimeSegment from "./TimeSegment/TimeSegment";
import { StyledCompactCountDown } from "./styleCompactCountDown";

export interface ICompactCountDownProps {
  datetime: string;
  time_fields: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  colorVariant?: 'primary' | 'secondary';
  textColor?: 'dark' | 'white';
}

const calculateTimeLeft = (eventDate: Date) => {
  const difference = eventDate.getTime() - new Date().getTime();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

const CompactCountDown: React.FC<ICompactCountDownProps> = ({ 
  datetime, 
  time_fields, 
  colorVariant = 'primary',
  textColor = 'dark'
}) => {
  const theme = useTheme();
  const eventDate = new Date(datetime);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(eventDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(eventDate));
    }, 1000);

    return () => clearTimeout(timer);
  }, [eventDate]);

  return (
    <StyledCompactCountDown theme={theme} textColor={textColor}>
      <TimeSegment value={timeLeft.days} label={time_fields.days} colorVariant={colorVariant} />
      <TimeSegment value={timeLeft.hours} label={time_fields.hours} colorVariant={colorVariant} />
      <TimeSegment value={timeLeft.minutes} label={time_fields.minutes} colorVariant={colorVariant} />
      <TimeSegment value={timeLeft.seconds} label={time_fields.seconds} colorVariant={colorVariant} />
    </StyledCompactCountDown>
  );
};

export default CompactCountDown; 