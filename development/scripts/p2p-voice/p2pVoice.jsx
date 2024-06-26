import { useContext} from "react";
import { BsFillMicFill } from "react-icons/bs";
import { BsMusicNoteList } from "react-icons/bs";
import {P2PContext} from "../components/p2pContext";

let myVoice ;
let start ;

const P2PVoice = () => {

    const { name , setName , startMic , stopStreaming , stream ,
        callAccepted, contactStream, callEnded , call } = useContext( P2PContext );

    // Stop Old Streams!
    if( start ){
        start = false ;
        if( name )
            startMic( ( micStream ) => {
                setTimeout( () => {
                    myVoice = document.getElementById( 'myVoice' );
                    myVoice.srcObject = micStream ;
                } , 500 );
            });
    }

    const saveName = () => {
        // Set Name
        setName( $( '#caller-name' ).val() );
        // Start Media
        startMic( ( micStream ) => {
            setTimeout( () => {
                myVoice = document.getElementById( 'myVoice' );
                myVoice.srcObject = micStream ;
            } , 500 );
        });
    }

    if( ! name ) return (
        <div className="row">
            <div className="col-12 col-sm-2 col-md-3"></div>
            <div className="col-12 col-sm-8 col-md-6 pb-4">
                <h3>
                    <BsFillMicFill />
                    &#160; Welcome To P2P Voice Call &#160;
                    <BsMusicNoteList />
                </h3>
                <br/>
                <input className="form-control form-control-lg text-center"
                       type="text" placeholder="Enter Your Name" id="caller-name"/>
                <div> &#160; </div>
                <button className="btn btn-primary btn-block"
                        onClick={() => saveName()}>
                    Save Name
                </button>
            </div>
            <div className="col-12 col-sm-2 col-md-3"></div>
        </div>
    ); else return (
        <div className="row">
        <h3>Welcome To P2P Voice Call</h3>
            <div className="col-12 col-6 p-4">
                {stream ? (
                    <div className="col-12">
                        <h3 className="h5">
                            {name ? name : "Name"}
                        </h3>
                        <audio autoPlay ref={myVoice} controls id="myVoice" />
                    </div>
                ) : ""}
            </div>
            <div className="col-12 col-6 p-4">
                {callAccepted && !callEnded ? (
                    <div className="col-12">
                        <h3 className="h5">
                            {call.name ? call.name : "Name"}
                        </h3>
                        <audio muted autoPlay ref={contactStream} controls/>
                    </div>
                ) : "No Call Received"}
            </div>
        </div>
    );
}

export default P2PVoice;