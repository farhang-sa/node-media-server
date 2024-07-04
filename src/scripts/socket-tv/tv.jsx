
import { BsCameraVideoFill } from "react-icons/bs";
import { BsFillTvFill } from "react-icons/bs";
import {BroadcastListeningView} from "../views/broadcastView.jsx";

const SocketTV = () => {

    return (
        <div className="row">
            <div className="col-12 col-sm-1 col-md-2"></div>
            <div className="col-12 col-sm-10 col-md-8 pb-4">
                <h3>
                    <BsCameraVideoFill/>
                    &#160; Welcome To Socket TV &#160;
                    <BsFillTvFill/>
                </h3>
                <br/>
                <div className="row">
                    <div className="col-12 col-sm-6 p-3">
                        <h5 className="h5">
                            Host : -----------
                        </h5>
                        <div className="row pt-3 pb-4 ps-3 pe-3">
                            <video
                                style={{borderRadius: 1}}
                                className="col-12"
                                autoPlay
                                controls/>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 p-3">
                        <BroadcastListeningView/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SocketTV;