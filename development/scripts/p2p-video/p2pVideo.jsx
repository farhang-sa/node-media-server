import {useContext, useEffect} from "react";
import { BsPersonVideo2 } from "react-icons/bs";
import { BsCameraVideoFill } from "react-icons/bs";

import {P2PContext} from "../components/p2pContext";
import {AnswerCallView, CallSomeBodyView} from "../views/callViews.jsx";

let myVideo , coVideo , coStream ;
let startStreaming ;
let playStreaming ;
let playContactStream ;

const P2PVideo = () => {

    const { name , setName , number , setNumber ,
        startCam , stream , setStream , contactStream ,
        contactFound , contactIO , contactId , callAccepted, callEnded , call } = useContext( P2PContext );

    if( contactStream )
        coStream = contactStream ;

    let callStatus = contactId.length > 0 ? "Calling " + contactId : "" ;
    if( contactFound !== 0 ) // Search is done!
        callStatus = contactIO.length > 0 ?
            "Connecting Socket " + contactIO : "Contact not found : " + contactId ;

    useEffect(() => {

        //console.log( "useEffect Exec In Voice Call" );

        startStreaming = () => {
            //console.log( "starting cam stream" );
            // View will refresh due to using setState
            startCam( ( camStream ) => setStream( camStream ) );
        }

        playStreaming = ( camStream ) => {
            //console.log( "playing cam stream" );
            myVideo = document.getElementById( 'myVideo' );
            myVideo.srcObject = camStream ;
        }

        playContactStream = () => {
            coVideo = document.getElementById( 'contactStream' );
            coVideo.srcObject = coStream ;
        }

        if( ! number )
            setNumber( window.getNumber() );

    }, []);

    if( name && name.length > 0 ){
        if( stream )
            setTimeout(() => playStreaming( stream ) , 500);
        else startStreaming();
    }

    const saveName = () => {
        // View will refresh due to using setStat
        setName( $( '#caller-name' ).val() + "" );
    }

    const AskName = () => {
        return (
            <div>
                <input className="form-control form-control-lg text-center"
                       type="text" placeholder="Enter Your Name" id="caller-name"/>
                <div> &#160; </div>
                <button className="btn btn-primary btn-block"
                        onClick={() => saveName()}>
                    Save Name
                </button>
            </div>
        );
    }

    const MyVideoStream = () => {
        return (
            <div className="col-12 col-sm-6 p-4">
                {stream ? (
                    <div className="col-12">
                        <h3 className="h5 mb-4">
                            {name ? name : "No Name"}
                        </h3>
                        <video muted autoPlay controls
                               className="col-12 mb-4"
                               id="myVideo"/>
                        <h3 className="h5">
                            Your Number : +98-{number}
                        </h3>
                    </div>
                ) : "No stream! : something wrong with cam?"}
            </div>
        );
    }

    const ContactVideoStream = () => {
        setTimeout( () => playContactStream() , 1000 );
        return (
            <div className="col-12">
                <h3 className="h5 mb-4">
                    {call.name ? call.name : "Contact Name"}
                </h3>
                <video autoPlay controls
                       className="col-12 mb-4"
                       id="contactStream"/>
                <h3 className="h5">
                    Contact : +98-{call.number}
                </h3>
            </div>
        );
    }

    return (
        <div className="row">
            <div className="col-12 col-sm-1 col-md-2"></div>
            <div className="col-12 col-sm-10 col-md-8 pb-4">
                <h3>
                    <BsPersonVideo2 />
                    &#160; WebRTC P2P Voice Call &#160;
                    <BsCameraVideoFill />
                </h3>
                <br/>
                {!name ? <AskName /> : (
                    <div className="row">
                        <MyVideoStream />
                        <div className="col-12 col-sm-6 p-4">
                            {callAccepted && !callEnded ? <ContactVideoStream /> : (
                                <div className="col-12">
                                    {call.isReceivingCall && !callAccepted ?
                                        <AnswerCallView /> :
                                        <CallSomeBodyView callInitialStatus={callStatus} />}
                                </div> )}
                        </div>
                    </div> )}
            </div>
            <div className="col-12 col-sm-1 col-md-2"></div>
        </div>
    );
}

export default P2PVideo;