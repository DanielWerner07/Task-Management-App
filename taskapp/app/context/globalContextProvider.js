"use client";
import React, { createContext, useState, useContext } from "react";

export const GlobalContext = createContext();
export const GlobalUpdateContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    return (
        <GlobalContext.Provider value={globalState}>
            <GlobalUpdateContext.Provider value={setGlobalStat}>
                {children}
            </GlobalUpdateContext.Provider>
        </GlobalContext.Provider>
    );
};