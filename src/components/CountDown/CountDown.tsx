import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { StyledCountDown, CountdownContainer, StyledTitle } from "./styleCountDown";
import Container from "../Container/Container";
import TimeSegment from "./TimeSegment/TimeSegment";

export interface ICountDownProps {}

// Helper function to calculate time remaining
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

const CountDown: React.FC<ICountDownProps> = () => {
  const theme = useTheme();

  // Set your event date here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const eventDate = new Date("2025-01-06T23:59:59");

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(eventDate));

  // Update the countdown every second
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(eventDate));
    }, 1000);

    return () => clearTimeout(timer);
  }, [eventDate]);

  return (
    <Container id="countdown_page" backgroundType="image" backgroundSrc="/source/g&d.jpg">
      <StyledCountDown theme={theme}>
        <StyledTitle theme={theme}>Event Countdown</StyledTitle>
        <CountdownContainer>
          <TimeSegment value={timeLeft.days} label="Days" />
          <TimeSegment value={timeLeft.hours} label="Hours" />
          <TimeSegment value={timeLeft.minutes} label="Minutes" />
          <TimeSegment value={timeLeft.seconds} label="Seconds" />
        </CountdownContainer>
      </StyledCountDown>
    </Container>
  );
};

export default CountDown;
