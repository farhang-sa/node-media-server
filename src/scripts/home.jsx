import {io} from "socket.io-client";
import {hostname, port} from "../hostPort";

const HomePage = ( props ) => {

    const genChannel = () =>{

    }

    const getNumber = () =>{

    }

    return (
        <div className="container">
            <h3>Welcome To Node Socket Server</h3>
            <button
                className="btn btn-lg btn-primary mt-4"
                    onClick={() => genChannel()}>
                Start Socket
            </button>
        </div>
    );
}

export default HomePage ;