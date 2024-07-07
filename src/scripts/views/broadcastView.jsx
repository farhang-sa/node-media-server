import {useContext, useEffect} from "react";
import {BsFillMicFill ,BsPower , BsHeadphones , BsFillRecordCircleFill } from "react-icons/bs";
import {AudioRecorder, AudioStreamer} from "jnaudiostream";
import { AppContext } from "../components/appContext";

export const JoinChannelView = () => {
    const { broadcastStatus , initListening } = useContext(AppContext);

    const startListening = () => {
        let channelId = $( 'input#channel_id' ).val();
        console.log( 'listening to ' , channelId );
        initListening( channelId );
    }

    return (
        <>
            <h5 className="h5 mb-4">
                Listen to a channel
            </h5>
            <div className="row mb-4 pt-1 ps-2 pe-2">
                {broadcastStatus !== 'hosting' &&
                (<div className="input-group">
                    <span className="input-group-text text-primary">Channel_</span>
                    <input className="form-control form-control-lg"
                           type="tel" id="channel_id"
                           placeholder="Channel Id"/>
                    <span className="input-group-text btn btn-lg btn-primary"
                          style={{cursor: "pointer"}}
                          onClick={() => startListening()}>
                        <BsHeadphones style={{width: '1.5em', height: '1.5em'}}/>
                    </span>
                </div>)}
                {broadcastStatus === 'hosting' && (
                    <h3 className="h5 mb-4">Listening disabled</h3>
                )}
            </div>
        </>
    );
}

let cStreamer ;
export const ListeningView = () => {
    const { channel , leaveChannel , setBroadcastStatus } = useContext( AppContext );

    const initLeave = () => {
        if( cStreamer )
            cStreamer.stop();
        leaveChannel();
        setBroadcastStatus( '-' );
    }

    useEffect(() => {

        // create streamer for listener
        cStreamer = new AudioStreamer(100);
        cStreamer.playStream();
        window.socket.on("channel_bufferHeader", ({ header }) => {
            if( ! cStreamer )
                return ;
            if ( cStreamer.mediaBuffer )
                return;
            cStreamer.setBufferHeader( header );
        });

        window.socket.on( 'channel_stream' , ({ data }) => {
            console.log( 'streamer : ' + cStreamer );
            if ( ! cStreamer )
                return ;
            if ( ! cStreamer.mediaBuffer )
                return;
            cStreamer.receiveBuffer( data );
        });

    }, []);

    const listeningStatus = 'Channel : ' + channel ;

    return (
        <>
            <h5 className="h5 mb-4">
                Listening
            </h5>
            <div className="col-12 mb-4 pt-1 ps-2 pe-0 input-group">
                <audio className="col-10 col-sm-9 col-lg-10 input-group-text"
                    id="channel_stream" controls autoPlay />
                <span className="col-2 col-sm-3 col-lg-2 input-group-text btn btn-lg btn-danger"
                        style={{cursor: "pointer",color:"black"}} onClick={() => initLeave()}>
                    <BsPower style={{width: '1.5em', height: '1.5em',color:"white"}}/>
                </span>
            </div>
            <h3 className="h5 mb-4">{listeningStatus}</h3>
        </>
    );
}

let recorder ;
export const HostingControlsView = ({startStream}) => {

    const { isRecording , setIsRecording , leaveChannel , setBroadcastStatus , number } = useContext( AppContext );

    useEffect(() => {

        // create recorder for host
        recorder = new AudioRecorder({}, 100); // 1ms

        recorder.onReady = (packet) => {
            console.log("Recording started!");
            console.log("Header size: " + packet.data.size + "bytes");
            window.socket.emit("channel_bufferHeader", { channel : number , header : packet } );
        };
        recorder.onBuffer = (packet) => {
            //console.log( "stream packet : " + packet );
            window.socket.emit("channel_stream", { channel : number , data : packet } );
        };

    }, []);

    const toggleStreaming = () => {
        isRecording ? recorder.stopRecording() : recorder.startRecording();
        setIsRecording( ! isRecording );
    }

    const stopStreaming = () => {
        setIsRecording( false )
        recorder.stopRecording();
        leaveChannel();
        setBroadcastStatus( '-' );
    }

    return (
        <>
            <span className="input-group-text btn btn-lg btn-primary"
                  onClick={() => toggleStreaming()} style={{cursor: "pointer"}}>
                {isRecording ? <BsFillRecordCircleFill style={{width: '1.5em', height: '1.5em'}}/> :
                    <BsFillMicFill style={{width: '1.5em', height: '1.5em'}}/>}
            </span>
            <span className="input-group-text btn btn-lg btn-danger"
                  onClick={() => stopStreaming()} style={{cursor: "pointer"}}>
                <BsPower style={{width: '1.5em', height: '1.5em'}}/>
            </span>
        </>
    );
}