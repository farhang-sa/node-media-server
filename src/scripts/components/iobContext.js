import { createContext, useState, useRef, useEffect } from 'react';

const IOBContext = createContext({});
const IOBContextProvider = ({ children }) => {

    const [listeningStatus, setListeningStatus] = useState("Not Listening" );

    useEffect(() => {
        console.log( "effect iob" );
    }, []);

    return (
        <IOBContext.Provider value={{
            listeningStatus
        }}>
            {children}
        </IOBContext.Provider>
    );

}

export { IOBContextProvider , IOBContext }
