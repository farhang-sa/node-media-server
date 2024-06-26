import { createContext, useState, useRef, useEffect } from 'react';
import Peer from 'simple-peer';

const P2PContext = createContext();
const P2PContextProvider = ({ children }) => {

    const [mySocketId, setMySocketId] = useState('');
    const [name, setName] = useState('');
    const [stream, setStream] = useState();

    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [call, setCall] = useState({});

    const contactStream = useRef();
    const connectionRef = useRef();

    const startMic = ( callback ) => {
        stopStreaming();
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((currentStream) => {
                console.log( "Streaming Audio" );
                setStream( currentStream );
                callback( currentStream );
            });
    }

    const startVideo = ( callback ) => {
        stopStreaming();
        navigator.mediaDevices.getUserMedia({ video: true , audio: true })
            .then((currentStream) => {
                console.log( "Streaming Video" );
                setStream( currentStream );
                callback( currentStream );
            });
    }

    const stopStreaming = ( stream ) => {
        if( ! stream || ! stream.getTracks() )
            return ;
        let vc = stream.getTracks().length ;
        console.log( "Stopping Streaming : " + vc );
        if( vc <= 0)
            return ;
        for( let v = 0 ; v <= vc.length - 1; v++ ){
            console.log( v + " - " + stream.getTracks()[v] );
            stream.getTracks()[v].stop();
        }
    }

    useEffect(() => {

        window.socket.on('me', ( id ) => setMySocketId(id) );
        window.socket.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });

    }, [] );

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on('signal', (data) => {
            window.socket.emit('answerCall', { signal: data, to: call.from });
        });
        peer.on('stream', (currentStream) => {
            contactStream.current.srcObject = currentStream;
        });
        peer.signal(call.signal);
        connectionRef.current = peer;
    };

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on('signal', (data) => {
            window.socket.emit('callUser', { userToCall: id, signalData: data, from: mySocketId, name });
        });
        peer.on('stream', (currentStream) => {
            contactStream.current.srcObject = currentStream;
        });
        window.socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    };

    return (
        <P2PContext.Provider value={{
            call,
            callAccepted,
            contactStream,
            stream,
            name,
            setName,
            callEnded,
            mySocketId,
            stopStreaming ,
            startVideo ,
            startMic ,
            callUser,
            leaveCall,
            answerCall,
        }}>
            {children}
        </P2PContext.Provider>
    );
};

export { P2PContextProvider, P2PContext };