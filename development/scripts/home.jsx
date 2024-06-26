import {io} from "socket.io-client";
import {hostname, port} from "./components/hostPort";

const HomePage = ( props ) => {

    const genChannel = () =>{

    }

    const getNumber = () =>{

    }

    return (
        <div className="container">
            <h3>Welcome To Node Socket Server</h3>
            <button
                className="btn btn-lg btn-primary"
                    onClick={ () => genChannel() } >
                Start Socket
            </button>
        </div>
    );
}

export default HomePage ;