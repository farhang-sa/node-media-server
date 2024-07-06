import {useContext, useEffect} from "react";
import { BsFillMicFill } from "react-icons/bs";
import { BsMusicNoteList } from "react-icons/bs";

import {AnswerCallView, CallSomeBodyView} from "../views/callViews.jsx";
import {AppContext} from "../components/appContext";

let coStream ;
let playStreaming ;
let playContactStream ;

const P2PVoice = () => {

    const { name , setName , number , stream , startMic , setStream , contactStream ,
        contactFound , contactIO , contactId , callAccepted, callEnded , call } = useContext( AppContext );

    if( contactStream ) {
        coStream = contactStream;
    }

    let callStatus = contactId.length > 0 ? "Calling " + contactId : "" ;
    if( contactFound !== 0 ) // Search is done!
        callStatus = contactIO.length > 0 ?
            "Connecting Socket " + contactIO : "Contact not found : " + contactId ;

    useEffect(() => {

        //console.log( "useEffect Exec In Voice Call" );

        playStreaming = ( micStream ) => {
            //console.log( "playing mic stream" );
            document.getElementById( 'myVoice' ).srcObject = micStream ;
        }

        playContactStream = () => {
            document.getElementById( 'contactStream' ).srcObject = coStream ;
        }


    }, []);

    if( name && name.length > 0 ){
        if( ! stream )
            startMic( ( newStream ) => setStream( newStream ) );
        else setTimeout(() => playStreaming( stream ) , 500);
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

    const MyAudioStream = () => {
        return (
            <div className="col-12">
                <h3 className="h5 mb-4">
                    {name ? name : "No Name"}
                </h3>
                <audio muted autoPlay controls
                    className="col-12 mb-4"
                    id="myVoice"/>
                <h3 className="h5">
                    Your Number : +98-{number}
                </h3>
            </div>
        );
    }

    const ContactAudioStream = () => {
        setTimeout( () => playContactStream() , 1000 );
        return (
            <div className="col-12">
                <h3 className="h5 mb-4">
                    {call.name ? call.name : "Contact Name"}
                </h3>
                <audio autoPlay controls
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
                    <BsFillMicFill/>
                    &#160; WebRTC P2P Voice Call &#160;
                    <BsMusicNoteList/>
                </h3>
                <br/>
                {!name ? <AskName /> : (
                <div className="row">
                    <div className="col-12 col-sm-6 p-4">
                        <MyAudioStream />
                    </div>
                    <div className="col-12 col-sm-6 p-4">
                        {callAccepted && !callEnded ? <ContactAudioStream /> : (
                            <div className="col-12">
                                {call.isReceivingCall && !callAccepted ?
                                    <AnswerCallView /> : <CallSomeBodyView
                                            callInitialStatus={callStatus} />}
                            </div>
                        )}
                    </div>
                </div> )}
            </div>
            <div className="col-12 col-sm-1 col-md-2"></div>
        </div>
    );
}

export default P2PVoice;