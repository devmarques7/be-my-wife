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
    TALK_TO_US: {
        TEXT: string;
        URL: string;
    };
};
CAROUSEL: {
  TITLE_CAROUSEL: string;
  PHOTOS_CAROUSEL: {
      SRC: string;
      DESCRIPTION: string;
  }[];
}
COUNTDOWN: {
  TITLE_COUNTDOWN: string;
  DATETIME_COUNTDOWN: string;
  TIME_FIELDS: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
  };
}
LOCATION: {
  TITLE_LOCATION: string;
  LEFT_TEXT: string;
  RIGHT_TEXT: string;
  URL_LOCATION: string;
  PHOTOS_LOCATION: {
      SRC: string;
  }[];
}
FOOTER: {
  SOCIAL_MEDIA: {
      INSTAGRAM: string;
      WHATSAPP: string;
  };
  COPYRIGHT: string;
}
PRIVACY: {
    DESCRIPTION: string;
    LINK: {
        TEXT: string;
        HREF: string;
    };
};
}
