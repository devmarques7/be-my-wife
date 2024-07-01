import { useContext } from "react";
import { GrFormClose } from "react-icons/gr";
import { useTheme } from "@mui/material";
import { Component } from "./stylePrivacyPolicy";
import { AppContext } from "../../context/AppContext";
import { Link } from "@mui/material";

const Privacy = (): JSX.Element => {
  const theme = useTheme();
  const { webContent, policy, handlePolicy } = useContext(AppContext);
  const { DESCRIPTION, LINK } = webContent.PRIVACY;

  return (
    <>
      {policy && (
        <Component theme={theme}>
          <div className="container ">
            <span className="policy description">{DESCRIPTION}</span>
            <Link href={LINK.HREF} className="policy link">
              {LINK.TEXT}
            </Link>
          </div>
          <button className="close policy" onClick={handlePolicy}>
            <GrFormClose className="icon" />
          </button>
        </Component>
      )}
    </>
  );
};

export default Privacy;
