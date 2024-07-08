import {AudioStreamer as AStream} from "jnaudiostream";

export class AudioStreamer extends AStream {

    /// is it possible ?!!
    target ;
    codec = 'audio/mp4; codecs="mp4a.40.2' ;
    sourceBuffer ;
    queue = [];
    mediaSource ;

    constructor(chunkDuration,audioElement) {
        super( chunkDuration );
        this.target = audioElement || this.audioElement ;
    }

    playStreamBuffer( buffer ){
        this.mediaSource = new MediaSource();
        this.mediaSource.addEventListener('sourceopen', ( e ) => {
            this.sourceBuffer = this.mediaSource.addSourceBuffer( this.codec );
            this.sourceBuffer.addEventListener('updateend', () => {
                //console.log( 'sourceBuffer ' , this.sourceBuffer.updating, this.mediaSource.readyState);
                if ( this.queue.length > 0 && ! this.sourceBuffer.updating) {
                    this.sourceBuffer.appendBuffer( this.queue.shift() );
                }
            });
        }, false);

        this.target.src = URL.createObjectURL( this.mediaSource ) ;
        setTimeout(() => this.receiveFileBuffer( buffer) , 200 );
    }

    receiveFileBuffer( blobData ){
        if ( this.mediaSource.readyState === "open") {
            if ( this.sourceBuffer.updating || this.queue.length > 0) {
                this.queue.push( blobData );
            } else {
                if( blobData instanceof ArrayBuffer ){
                    this.sourceBuffer.appendBuffer( blobData );
                    return ;
                } // else :
                let reader = new FileReader();
                let rawData = new ArrayBuffer(0);
                reader.onload = (e) => {
                    rawData = e.target.result;
                    this.sourceBuffer.appendBuffer( rawData );
                }
                reader.readAsArrayBuffer( blobData );
            }
        }
    }

    stopBuffer(){
        // release/clean all
        this.queue = [];
        this.sourceBuffer = null ;
        this.mediaSource = null ;
    }

}