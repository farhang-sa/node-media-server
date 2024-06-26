import {useContext} from "react";
import { BsPersonVideo2 } from "react-icons/bs";
import { BsCameraVideoFill } from "react-icons/bs";
import {P2PContext} from "../components/p2pContext";

let myVideo ;
let start = true ;

const P2PVideo = () => {

    const { name , setName , startVideo , stopStreaming , stream ,
        callAccepted, contactStream, callEnded , call } = useContext( P2PContext );

    // Stop Old Streams!
    if( start ){
        start = false ;
        if( name )
            startVideo( ( micStream ) => {
                setTimeout( () => {
                    myVideo = document.getElementById( 'myVideo' );
                    myVideo.srcObject = micStream ;
                } , 500 );
            });
    }

    const saveName = () => {
        // Set Name
        setName( $( '#caller-name' ).val() );
        // Start Media
        startVideo( ( micStream ) => {
            setTimeout( () => {
                myVideo = document.getElementById( 'myVideo' );
                myVideo.srcObject = micStream ;
            } , 500 );
        });
    }

    if( ! name ) return (
        <div className="row">
            <div className="col-12 col-sm-2 col-md-3"></div>
            <div className="col-12 col-sm-8 col-md-6 pb-4">
                <h3>
                    <BsCameraVideoFill />
                    &#160; Welcome To P2P Video Call &#160;
                    <BsPersonVideo2 />
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
            <h3>Welcome To P2P Video Call</h3>
            <div className="col-12 col-6 p-4">
                {stream ? (
                    <div className="col-12">
                        <h3 className="h5">
                            {name ? name : "Name"}
                        </h3>
                        <video autoPlay controls
                                ref={myVideo}
                                id="myVideo"
                                style={{width:400,height:400}} />
                    </div>
                ) : ""}
            </div>
            <div className="col-12 col-6 p-4">
                {callAccepted && !callEnded ? (
                    <div className="col-12">
                        <h3 className="h5">
                            {call.name ? call.name : "Name"}
                        </h3>
                        <video muted autoPlay controls
                               ref={contactStream}
                               id="contactVideo"
                               style={{width: 400, height: 400}}/>
                    </div>
                ) : "No Call Received"}
            </div>
        </div>
    );
}

export default P2PVideo;