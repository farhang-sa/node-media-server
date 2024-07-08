import {VideoStreamer} from "./farsavideostreamer";

export class VideoRecorder {

    recording = false ;
    codec = 'video/webm;codecs="opus, vp9"' ;
    audioRate = 128000 ; // 128kb/s
    videoRate = 896000 ; // 896kb/s
    latency = 1000 ; // 1sec
    recorder = null;
    stream = null ;
    videoElement = null ; // Preview Recording!
    options ;

    defaultOptions(){
        return {
            codec     : this.codec ,
            audioRate : this.audioRate ,
            videoRate : this.videoRate , // total 1m/s
            latency   : this.latency
        };
    }

    onData = blobData => {}

    constructor( options , VideoTag , stream ) {
        this.options = options || this.defaultOptions();
        if( VideoTag && VideoTag instanceof HTMLVideoElement )
            this.videoElement = VideoTag || null ;
        else if( VideoTag && VideoTag instanceof MediaStream)
            this.stream = VideoTag || null ;
        if( stream && stream instanceof MediaStream )
            this.stream = stream ;
        // make it safe and ok
        if( this.options.audioRate < 50000 )
            this.options.audioRate = 50000 ;
        if( this.options.videoRate < 100000 )
            this.options.videoRate = 100000 ;
        if( this.options.latency < 100 )
            this.options.latency = 100 ;
    }

    initRecorder( stream ){
        // preview stream
        if( this.videoElement ){
            this.videoElement.muted = true ;
            this.videoElement.srcObject = stream;
        } // create new recorder
        this.stream = stream ;
        this.recorder = new MediaRecorder( stream , {
            mimeType : this.options.codec ? this.options.codec : this.codec ,
            audioBitsPerSecond :
                this.options.audioRate ? this.options.audioRate : this.audioRate ,
            videoBitsPerSecond :
                this.options.videoRate ? this.options.videoRate : this.videoRate
        });

        this.recorder.ondataavailable = ( newRecord ) => {
            // new blob of recorded video
            if( newRecord.data && newRecord.data.size > 0 )
                this.onData ? this.onData( newRecord.data ) : null ;
        };

        this.recorder.start( this.options.latency ? this.options.latency : this.latency );
    }

    startRecording() {
        if( this.recorder && this.recorder.state === 'recording' )
            return ; // already in business
        this.recording = true ;
        // check if stream is already provided
        if( this.stream )
            return this.initRecorder( this.stream );
        // access cam/mic
        navigator.mediaDevices.getUserMedia({ video: true , audio: true })
            .then( (mediaStream) => this.initRecorder( mediaStream ) );
    }

    stopRecording(){
        this.recording = false ;
        if( this.recorder.state === 'inactive' )
            return ; // already stopped ;
        // stop it!
        this.recorder.stop();
        // free cam/mic
        if( ! this.stream || ! this.stream.getTracks() )
            return ;
        this.stream.getTracks().forEach( (track) => track.stop() );
        // clean all
        this.stream = null ;
        this.recorder = null ;
    }

    recordFromFile( buffer ){
        const streamer = new VideoStreamer( this.videoElement );
        streamer.playStream();
        streamer.receiveBuffer( buffer );
    }

}