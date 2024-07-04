import { createContext, useState, useRef, useEffect } from 'react';

const IOBContext = createContext({});
const IOBContextProvider = ({ children }) => {

    const [listeningStatus, setListeningStatus] = useState("Not Listening" );

    return (
        <IOBContext.Provider value={{
            listeningStatus
        }}>
            {children}
        </IOBContext.Provider>
    );

}

export { IOBContextProvider , IOBContext }
