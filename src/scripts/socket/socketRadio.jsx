
import {BsFillMicFill ,BsMusicNoteList , BsFillMicMuteFill, BsHeadset } from "react-icons/bs";
import {ListeningView, HostingControlsView, JoinChannelView} from "../views/broadcastView.jsx";
import {useContext, useEffect} from "react";
import {AppContext} from "../components/appContext";
import {AudioStreamer} from "jnaudiostream";

const SocketRadio = () => {

    const { number , broadcastStatus , initHosting , startMic } = useContext( AppContext );
    const channel = "Channel_" + number ;

    useEffect(() => {

        // console.log("Radio Effect" );

    }, []);

    return (
        <div className="row">
            <div className="col-12 col-sm-1 col-md-2"></div>
            <div className="col-12 col-sm-10 col-md-8 pb-4">
                <h3>
                    <BsFillMicFill/>
                    &#160; Welcome To Socket Radio &#160;
                    <BsMusicNoteList/>
                </h3>
                <br/>
                <div className="row">
                    <div className="col-12 col-sm-6 p-4">
                        <h5 className="h5 mb-4">
                            Host
                        </h5>
                        <div className="row mb-4 me-0 ms-0 pe-0 ps-0">
                            {broadcastStatus !== 'listening' &&
                            <div className="col-12 input-group mb-4 me-0 ms-0 pe-0 ps-0">
                                <audio style={{borderRadius: 1}}
                                       className="col-8 input-group-text"
                                       autoPlay
                                       controls/>
                                {broadcastStatus === 'hosting' ?
                                (<HostingControlsView startStream={startMic}/> ) :
                                (<span className="col-4 input-group-text btn btn-lg btn-primary"
                                       onClick={() => initHosting()}>
                                    <BsHeadset style={{width:'1.5em', height: '1.5em'}} />
                                </span>)}
                            </div>}
                        </div>
                        <h3 className="h5">
                            {broadcastStatus === 'listening' ? "Hosting disabled" : ( "Your Channel : " + channel ) }
                        </h3>
                    </div>
                    <div className="col-12 col-sm-6 p-4">
                        {broadcastStatus === 'listening' && <ListeningView />}
                        {broadcastStatus !== 'listening' && <JoinChannelView />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SocketRadio;