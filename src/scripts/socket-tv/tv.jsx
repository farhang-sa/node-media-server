
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
                    <div className="col-12 col-sm-6 p-4">
                        <h5 className="h5 mb-4">
                            Host : -----------
                        </h5>
                        <video style={{borderRadius: 1}}
                           className="col-12 mb-4"
                           autoPlay
                           controls/>
                        <h3 className="h5">
                            Tv Actions
                        </h3>
                    </div>
                    <div className="col-12 col-sm-6 p-4">
                        <BroadcastListeningView/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SocketTV;