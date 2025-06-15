import { createContext, useEffect, useState } from "react";
import { WEB_SITE_CONTENT_PT } from "../languages/PT";
import { WEB_SITE_CONTENT_EN } from "../languages/EN";
import { ContextsProps, IWebContent } from "../interfaces/ContextsProps";

interface IAppContext {
  language: string;
  handleLanguage: (event: any) => void;
  webContent: IWebContent;
  policy: boolean;
  handlePolicy: () => void;
}

export const AppContext = createContext<IAppContext>({} as IAppContext);

const AppContextProvider = ({ children }: ContextsProps) => {
  const [language, setLanguage] = useState("PT");
  const [webContent, setWebContent] = useState(WEB_SITE_CONTENT_PT);
  const [policy, setPolicy] = useState(true);

  const handleLanguage = (event: any): void => {
    setLanguage(event.target.className);
  };

  const handlePolicy = () => {
    setPolicy(false);
  };

  useEffect(() => {
    switch (language) {
      case "EN":
        return setWebContent(WEB_SITE_CONTENT_EN);
      case "PT":
        return setWebContent(WEB_SITE_CONTENT_PT);
    }
  }, [language]);

  return (
    <AppContext.Provider
      value={{ language, handleLanguage, webContent, policy, handlePolicy }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
