import React, { createContext, useContext, useState } from 'react';

const ExamSessionContext = createContext();

export const ExamSessionProvider = ({ children }) => {
    const [currentExamSession, setCurrentExamSession] = useState(null);

    return (
        <ExamSessionContext.Provider value={{ currentExamSession, setCurrentExamSession }}>
            {children}
        </ExamSessionContext.Provider>
    );
};

export const useExamSession = () => {
    return useContext(ExamSessionContext);
};