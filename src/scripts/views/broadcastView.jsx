import {useContext} from "react";
import {IOBContext} from "../components/iobContext";
import {BsTelephoneFill, BsHeadphones} from "react-icons/bs";


export const BroadcastListeningView = () => {
    const { listeningStatus } = useContext(IOBContext);

    const startListening = () => {

    }

    return (
        <>
            <h5 className="h5 mb-4">
                Listener
            </h5>
            <div className="row mb-4 pt-1 ps-2 pe-2">
                <div className="input-group">
                    <span className="input-group-text">Channel_</span>
                    <input className="form-control form-control-lg"
                           type="tel" id="contact-number"
                           placeholder="Channel Id"/>
                    <span className="input-group-text"
                          style={{cursor: "pointer"}}
                          onClick={() => startListening()}>
                        <BsHeadphones style={{width: '1.5em', height: '1.5em'}}/>
                    </span>
                </div>
            </div>
            <h3 className="h5 mb-4">{listeningStatus}</h3>
        </>);
}