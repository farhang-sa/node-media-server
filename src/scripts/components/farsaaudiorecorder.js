import {AudioRecorder as ARec} from "jnaudiostream";
import {AudioStreamer} from "./farsaaudiostreamer";

export class AudioRecorder extends ARec {

    constructor( Options , latency ) {
        super( Options , latency );
    }

    recordFromBuffer( buffer , targetAudioElement ){
        const streamer = new AudioStreamer( 100 , targetAudioElement );
        streamer.playStreamBuffer( buffer );
        //streamer.receiveFileBuffer( buffer );
    }

}