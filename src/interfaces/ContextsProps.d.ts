import { ReactNode } from "react";

export interface ContextsProps {
  children: ReactNode;
}

export interface IWebContent {
  HEADER: {
    ICON: string;
    TITLE: string;
    NAVBAR: string[];
    LANGUAGES: string[];
};
PRIVACY: {
    DESCRIPTION: string;
    LINK: {
        TEXT: string;
        HREF: string;
    };
};
}
