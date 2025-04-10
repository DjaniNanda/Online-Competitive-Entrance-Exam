import React, { createContext } from 'react';
import apiClient from '../apiClient';

export const ApiContext = createContext();

export const ApiProvider = ({ children, customApiClient = apiClient }) => {
    return (
        <ApiContext.Provider value={customApiClient}>
            {children}
        </ApiContext.Provider>
    );
};