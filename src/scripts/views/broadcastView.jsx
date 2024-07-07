import {useContext, useEffect} from "react";
import {BsFillMicFill, BsFillRecordCircleFill, BsHeadphones, BsPower} from "react-icons/bs";
import {AudioRecorder, AudioStreamer} from "jnaudiostream";
import {VideoRecorder} from "../components/farsavideorecorder";
import {VideoStreamer} from "../components/farsavideostreamer";
import {AppContext} from "../components/appContext";

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

let aStreamer ;
export const ListeningView = () => {
    const { channel , leaveChannel , setBroadcastStatus } = useContext( AppContext );

    const initLeave = () => {
        if( aStreamer )
            aStreamer.stop();
        leaveChannel();
        setBroadcastStatus( '-' );
    }

    useEffect(() => {

        // create streamer for listener
        aStreamer = new AudioStreamer(100);
        aStreamer.playStream();
        window.socket.on("channel_bufferHeader", ({ header }) => {
            if( ! aStreamer )
                return ;
            if ( aStreamer.mediaBuffer )
                return;
            aStreamer.setBufferHeader( header );
        });

        window.socket.on( 'channel_stream' , ({ data }) => {
            console.log( 'streamer : ' + aStreamer );
            if ( ! aStreamer )
                return ;
            if ( ! aStreamer.mediaBuffer )
                return;
            aStreamer.receiveBuffer( data );
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

let aRecorder ;
export const RadioHostingControls = () => {

    const { isRecording , setIsRecording , leaveChannel , setBroadcastStatus , number } = useContext( AppContext );

    useEffect(() => {

        // create recorder for host
        aRecorder = new AudioRecorder({}, 100); // 1ms

        aRecorder.onReady = (packet) => {
            console.log("Recording started!");
            console.log("Header size: " + packet.data.size + "bytes");
            window.socket.emit("channel_bufferHeader", { channel : number , header : packet } );
        };
        aRecorder.onBuffer = (packet) => {
            //console.log( "stream packet : " + packet );
            window.socket.emit("channel_stream", { channel : number , data : packet } );
        };

    }, []);

    const toggleStreaming = () => {
        isRecording ? aRecorder.stopRecording() : aRecorder.startRecording();
        setIsRecording( ! isRecording );
    }

    const stopStreaming = () => {
        setIsRecording( false )
        aRecorder.stopRecording();
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


let vStreamer ;
export const WatchingView = () => {
    const { channel , leaveChannel , setBroadcastStatus } = useContext( AppContext );

    const initLeave = () => {
        if( vStreamer )
            vStreamer.stop();
        leaveChannel();
        setBroadcastStatus( '-' );
    }

    useEffect(() => {

        // create streamer for listener
        vStreamer = new VideoStreamer( document.getElementById('channel_stream') );
        vStreamer.playStream();

        /*window.socket.on("channel_bufferHeader", ({ header }) => {
            if( ! vStreamer )
                return ;
            if ( vStreamer.mediaBuffer )
                return;
            vStreamer.setBufferHeader( header );
        });*/

        window.socket.on( 'channel_stream_stop' , () => {
            // reset and wait for new stream!
            vStreamer = new VideoStreamer( document.getElementById('channel_stream') );
        });

        window.socket.on( 'channel_stream' , ({ data }) => {
            if ( ! vStreamer )
                return ;
            /*console.log( 'buffer : ' + vStreamer.mediaBuffer );
            if ( ! vStreamer.mediaBuffer )
                return;*/
            vStreamer.receiveBuffer( data );
        });

    }, []);

    const listeningStatus = 'Channel : ' + channel ;

    return (
        <>
            <h5 className="h5 mb-4">
                Listening
            </h5>
            <div className="col-12 mb-4 pt-1 ps-2 pe-0">
                <video className="col-12 mb-2"
                       id="channel_stream" controls autoPlay />
                <span className="btn btn-lg btn-danger"
                      style={{cursor: "pointer",color:"black"}} onClick={() => initLeave()}>
                    <BsPower style={{width: '1.5em', height: '1.5em',color:"white"}}/>
                </span>
            </div>
            <h3 className="h5 mb-4">{listeningStatus}</h3>
        </>
    );
}

let vRecorder ;
export const TvHostingControls = () => {

    const { isRecording , setIsRecording , leaveChannel , setBroadcastStatus , number } = useContext( AppContext );

    useEffect(() => {

        let tag = document.getElementById( 'previewVideoTag' );
        vRecorder = new VideoRecorder( null , tag );
        vRecorder.onData = ( packet ) => {
            window.socket.emit("channel_stream", { channel : number , data : packet } );
        }

    }, []);

    const toggleStreaming = () => {
        isRecording ? vRecorder.stopRecording() : vRecorder.startRecording();
        setIsRecording( ! isRecording );
        window.socket.emit( 'channel_stream_stop' , { channel : number } );
    }

    const stopStreaming = () => {
        setIsRecording( false )
        vRecorder.stopRecording();
        leaveChannel();
        setBroadcastStatus( '-' );
        window.socket.emit( 'channel_stream_stop' , { channel : number } );
    }

    const iconsStyles = {width: '1.5em', height: '1.5em' , borderRadius:0};

    return (
        <>
            <span className="btn btn-lg btn-primary"
                  onClick={() => toggleStreaming()} style={{cursor: "pointer"}}>
                {isRecording ? <BsFillRecordCircleFill style={iconsStyles}/> :
                    <BsFillMicFill style={iconsStyles}/>}
            </span>
            <span className="btn btn-lg btn-danger"
                  onClick={() => stopStreaming()} style={{cursor: "pointer"}}>
                <BsPower style={iconsStyles}/>
            </span>
        </>
    );
}