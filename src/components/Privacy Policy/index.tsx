import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "../../../contexts/AppContext";
import { GrFormClose } from "react-icons/gr";

import { Component } from "./style";

const Privacy = (): JSX.Element => {
  const { webContent, policy, handlePolicy } = useContext(AppContext);
  const { description, link } = webContent.PRIVACY;

  return (
    <>
      {policy && (
        <Component>
          <div className="container ">
            <span className="policy description">{description}</span>
            <Link href={link.href} className="policy link">
              {link.text}
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
