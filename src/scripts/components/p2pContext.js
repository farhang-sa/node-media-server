import { createContext, useState, useRef, useEffect } from 'react';
import Peer from 'simple-peer';

const P2PContext = createContext({});
const P2PContextProvider = ({ children }) => {

    const [mySocketId, setMySocketId] = useState('');
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');

    const [contactFound, setContactFound] = useState( 0 );
    const [contactId, setContactId] = useState( '' );
    const [contactIO, setContactIO] = useState( '' );
    const [contactStream, setContactStream] = useState();

    const [stream, setStream] = useState();

    const [callStatus, setCallStatus] = useState('');
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [call, setCall] = useState({});

    useEffect(() => {

        window.socket.on('setSocketId', ( id ) => {
            setMySocketId( id );
        });
        window.socket.on('callReceive', ({ from, callerName , number , signal }) => {
            setCall({ isReceivingCall: true, from , name: callerName , number , signal });
        });

        window.socket.emit( "setSessionId" , { sid : window.getMySid() });

    }, [] );

    const startMic = ( callback ) => {
        stopStreaming( stream );
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((micStream) => {
                console.log( "streaming mic audio" );
                //setStream( micStream );
                callback( micStream );
            });
    }

    const startCam = (callback ) => {
        stopStreaming( stream );
        navigator.mediaDevices.getUserMedia({ video: true , audio: true })
            .then((camAndMicStream) => {
                console.log( "streaming cam video" );
                //setStream( camAndMicStream );
                callback( camAndMicStream );
            });
    }

    const stopStreaming = ( stream ) => {
        if( ! stream || ! stream.getTracks() ){
            console.log( "no previous streaming" );
            return ;
        } let vc = stream.getTracks().length ;
        console.log( "stopping streaming : " + vc );
        if( vc <= 0)
            return ;
        stream.getTracks().forEach(function(track) {
            console.log( "track stop : " + track.id );
            track.stop();
        });
    }

    const startCalling = ( contactNumber ) => {
        setContactId( contactNumber );
        setContactFound( 2 ); // Searching !
        window.socket.on( 'foundContactIO', ( io ) => {
            console.log( 'contact io : ' + io );
            if( mySocketId === io ){
                console.log( 'contacting yourself !' );
                setContactIO( '' );
                setContactFound( -1 );
                return ;
            } // else :
            setContactFound( 1 );
            setContactIO( io );
            callUser( io , mySocketId , name );
        });
        window.socket.on( 'noContactIO', ( cid ) => {
            console.log( 'contact not found : ' + cid );
            setContactIO( '' );
            setContactFound( -1 );
        });
        window.socket.emit( 'getContactIO'  , { cid : contactNumber });
    }

    const answerCall = ( call ) => {
        setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on('signal', (data) => {
            window.socket.emit('answerCall',
                { signal: data, to : call.from , from : mySocketId , name , number });
        });
        peer.on('stream', ( peerStream ) => {
            setContactStream( peerStream );
        });
        peer.signal( call.signal );
    };

    const callUser = ( contactIO ) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on('signal', (data) => {
            window.socket.emit('callUser', {
                userToCall: contactIO , signalData: data, from : mySocketId, name , number : window.getNumber() });
        });
        peer.on('stream', (peerStream) => {
            setContactStream( peerStream );
        });
        window.socket.on('callAccepted', ({ signal , from , cName , cNumber }) => {
            setCall({ from , name: cName , number : cNumber , signal } );
            setCallAccepted(true);
            peer.signal(signal);
        });
    };

    const leaveCall = () => {
        setCallEnded(true);
        window.location.reload();
    };

    return (
        <P2PContext.Provider value={{
            call,
            callAccepted,
            contactStream,
            contactFound ,
            contactId ,
            contactIO ,
            stream,
            setStream ,
            number ,
            setNumber ,
            name,
            setName,
            callEnded,
            mySocketId,
            callStatus ,
            setCallStatus ,
            startCalling ,
            stopStreaming ,
            startCam ,
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