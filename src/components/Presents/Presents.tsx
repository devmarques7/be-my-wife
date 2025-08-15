import React from "react";
import { useTheme } from "@mui/material";
import { StyledPresents } from "./stylePresents";
import Container from "../Container/Container";
import CountDown from "../CountDown/CountDown";
import { AppContext } from "../../context/AppContext";

const Presents: React.FC = () => {
  const theme = useTheme();
  const { webContent } = React.useContext(AppContext);
  const { TITLE_COUNTDOWN, DATETIME_COUNTDOWN, TIME_FIELDS } = webContent.COUNTDOWN;
  const { TITLE, DESCRIPTION } = webContent.PRESENTS;

  return (
    <Container id="presents_page" backgroundType="image" backgroundSrc="/source/g&d.jpg">
      <StyledPresents theme={theme}>
        <CountDown 
          title={TITLE_COUNTDOWN} 
          datetime={DATETIME_COUNTDOWN} 
          time_fields={TIME_FIELDS}
        />
        <div className="presents-content">
          <h2>{TITLE}</h2>
          <p>{DESCRIPTION}</p>
        </div>
      </StyledPresents>
    </Container>
  );
};

export default Presents; 