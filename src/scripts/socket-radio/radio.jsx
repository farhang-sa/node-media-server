
import {BsFillMicFill,BsMusicNoteList} from "react-icons/bs";
import {BroadcastListeningView} from "../views/broadcastView.jsx";
import {useContext, useEffect} from "react";
import {AppContext} from "../components/appContext";

const SocketRadio = () => {

    const { mySocketId , number , IOBContext } = useContext( AppContext );
    const channel = "Channel_" + number ;
    const listeningStatus = "Not Listening";

    useEffect(() => {

        console.log("Radio Effect" );

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
                            Host : {channel}
                        </h5>
                        <audio style={{borderRadius: 1}}
                           className="col-12 mb-4"
                           autoPlay
                           controls/>
                        <h3 className="h5">
                            Radio Actions
                        </h3>
                    </div>
                    <div className="col-12 col-sm-6 p-4">
                        <BroadcastListeningView />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SocketRadio;