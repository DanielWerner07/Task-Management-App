"use client";
import React, { createContext, useState, useContext } from "react";

export const GlobalContext = createContext();
export const GlobalUpdateContext = createContext();

export const GlobalContextProvider = ({ children }) => {

    const [selectedTheme, setSelectedTheme] = useState(0);
    const theme = themes[selectedTheme];

    return (
        <GlobalContext.Provider 
            value={{
                theme,
            }}>
            <GlobalUpdateContext.Provider value={setGlobalStat}>
                {children}
            </GlobalUpdateContext.Provider>
        </GlobalContext.Provider>
    );
};

export const useGlobalState = () => useContext(GlobalContext);
export const useGlobalUpdate = () => useContext(GlobalUpdateContext);