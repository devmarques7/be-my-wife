import React, { createContext, ReactNode } from "react";

interface PropsReactNode {
    children?: ReactNode;
}

interface AppContextProps {
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppContextProvider: React.FC<PropsReactNode> = ({ children }) => {


    return (
        <AppContext.Provider value={{
        }}>
            {children}
        </AppContext.Provider>
    );
};
