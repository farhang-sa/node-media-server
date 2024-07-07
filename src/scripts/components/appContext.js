import {createContext, useState, useEffect, } from 'react';
import Peer from 'simple-peer';
import {AudioStreamer} from "jnaudiostream";

const AppContext = createContext({});

const AppContextProvider = ({ children }) => {

    // General Starts
    const [mySocketId, setMySocketId] = useState('');
    const [number, setNumber] = useState('');

    // P2P Stats
    const [name, setName] = useState('' );
    const [contactFound, setContactFound] = useState( 0 );
    const [contactId, setContactId] = useState( "" );
    const [contactIO, setContactIO] = useState( "" );
    const [contactStream, setContactStream] = useState();
    const [stream, setStream] = useState();
    const [callStatus, setCallStatus] = useState('');
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [call, setCall] = useState({});

    // IOB Stats
    const [broadcastStatus , setBroadcastStatus ] = useState('-');
    const [isRecording , setIsRecording ] = useState(false );
    const [channel , setChannel ] = useState('' );
    const [streamer , setStreamer ] = useState({} );

    useEffect(() => {

        //console.log("AppContextProvider Effect");

        // Set MySocketId
        window.socket.on('setSocketId', ( id ) => {
            setMySocketId( id );
        });
        window.socket.emit( "setSessionId" , { sid : window.getMySid() });

        // Set Number
        setNumber( window.getNumber() );

        // P2P Actions
        window.socket.on('callReceive', ({ from, callerName , number , signal }) => {
            setCall({ isReceivingCall: true, from , name: callerName , number , signal });
        });

        // IOB Actions


    }, [] );

    // Start streaming from MIC
    const startMic = ( callback ) => {
        stopStreaming( stream );
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((micStream) => {
                console.log( "streaming mic audio" );
                //setStream( micStream );
                callback( micStream );
            });
    }

    // Start streaming from CAM
    const startCam = (callback ) => {
        stopStreaming( stream );
        navigator.mediaDevices.getUserMedia({ video: true , audio: true })
            .then((camAndMicStream) => {
                console.log( "streaming cam video" );
                //setStream( camAndMicStream );
                callback( camAndMicStream );
            });
    }

    // Stop streaming
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

    /////////////////
    /// P2P Functions
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
        window.socket.emit( 'getContactIO'  , { contactId : contactNumber });
    }

    const answerCall = ( call ) => {
        setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on('signal', (data) => {
            window.socket.emit('answerCall' ,
                { signal: data, to : call.from , from : mySocketId , name , number });
        });
        peer.on('stream', ( peerStream ) => {
            console.log( 'contact calling stream : ' + peerStream )
            setContactStream( peerStream );
        });
        peer.signal( call.signal );
    };

    const callUser = ( contactIO ) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on('signal', (data) => {
            window.socket.emit('callUser', {
                userToCall: contactIO , signalData: data, from : mySocketId, name , number });
        });
        peer.on('stream', (peerStream) => {
            console.log( 'contact answering stream : ' + peerStream )
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


    /////////////////
    /// IOB Functions
    const initHosting = () => {
        setBroadcastStatus( 'hosting' );
        window.socket.emit( 'host_init',  window.getMySid() );
    }

    const initListening = ( newChannel ) => {
        setBroadcastStatus( 'listening' );
        setChannel( newChannel );
        window.socket.emit( 'listener_join' , { sid : window.getMySid() , channel : newChannel } );
    }

    const leaveChannel = () => {
        window.socket.emit( "listener_leave" , { sid : window.getMySid() } );
    }

    const allStates = { mySocketId , number ,
        name , setName ,
        contactFound , setContactFound , contactId , setContactId ,
        contactIO , setContactIO , contactStream , setContactStream ,
        stream , setStream ,
        callStatus , setCallStatus , callAccepted ,
        setCallAccepted , callEnded , setCallEnded , call , setCall ,
        startMic , startCam , stopStreaming ,
        answerCall , leaveCall , callUser , startCalling ,
        broadcastStatus , setBroadcastStatus ,
        isRecording , setIsRecording , channel , streamer , setStreamer ,
        initHosting , initListening , leaveChannel
    };

    return (
        <AppContext.Provider value={allStates}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext , AppContextProvider };