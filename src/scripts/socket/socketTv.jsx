import {BsCameraVideoFill , BsFillTvFill,BsWebcamFill  } from "react-icons/bs";
import {JoinChannelView, WatchingView, TvHostingControls} from "../views/broadcastView.jsx";
import {useContext, useEffect} from "react";
import {AppContext} from "../components/appContext";

const SocketTv = () => {

    const { number , broadcastStatus , initHosting , startCam } = useContext( AppContext );
    const channel = "Channel_" + number ;

    useEffect(() => {

        // console.log("Radio Effect" );

    }, []);

    return (
        <div className="row">
            <div className="col-12 col-sm-1 col-md-2"></div>
            <div className="col-12 col-sm-10 col-md-8 pb-4">
                <h3>
                    <BsCameraVideoFill />
                    &#160; Welcome To Socket Tv &#160;
                    <BsFillTvFill />
                </h3>
                <br/>
                <div className="row">
                    <div className="col-12 col-sm-6 p-4">
                        <h5 className="h5 mb-4">
                            Host
                        </h5>
                        <div className="col-12 mb-4 me-0 ms-0 pe-0 ps-0">
                            {broadcastStatus !== 'listening' &&
                            <>
                                <video style={{borderRadius: 1}}
                                       className="col-12"
                                       id="previewVideoTag"
                                       autoPlay
                                       muted
                                       controls/>
                                {broadcastStatus === 'hosting' ?
                                (<TvHostingControls startStream={startCam}/> ) :
                                (<span className="btn btn-lg btn-primary mt-0"
                                           onClick={() => initHosting()}>
                                    <BsWebcamFill style={{width:'1.5em', height: '1.5em'}} />
                                </span>)}
                            </>}
                        </div>
                        <h3 className="h5">
                            {broadcastStatus === 'listening' ? "Hosting disabled" : ( "Your Channel : " + channel ) }
                        </h3>
                    </div>
                    <div className="col-12 col-sm-6 p-4">
                        {broadcastStatus === 'listening' && <WatchingView />}
                        {broadcastStatus !== 'listening' && <JoinChannelView />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SocketTv;