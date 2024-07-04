
import {BsFillMicFill,BsMusicNoteList} from "react-icons/bs";
import {BroadcastListeningView} from "../views/broadcastView.jsx";

const SocketRadio = () => {

    const channel = "Channel_" + Date.now();
    const listeningStatus = "Not Listening";

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
                    <div className="col-12 col-sm-6 p-3">
                        <h5 className="h5">
                            Host : {channel}
                        </h5>
                        <div className="row pt-3 pb-4 ps-3 pe-3">
                            <audio
                                style={{borderRadius: 1}}
                                className=""
                                autoPlay
                                controls/>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 p-3">
                        <BroadcastListeningView />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SocketRadio;