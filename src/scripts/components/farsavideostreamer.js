
export class VideoStreamer {

    codec = 'video/webm; codecs="opus, vp9"' ;
    target ;
    sourceBuffer ;
    queue = [];
    mediaSource ;

    constructor( targetVideoElement ) {
        this.target = targetVideoElement ;
    }

    playStream(){
        this.mediaSource = new MediaSource();
        this.mediaSource.addEventListener('sourceopen', ( e ) => {
            this.sourceBuffer = this.mediaSource.addSourceBuffer(this.codec );
            this.sourceBuffer.addEventListener('updateend', () => {
                //console.log( 'sourceBuffer ' , this.sourceBuffer.updating, this.mediaSource.readyState);
                if ( this.queue.length > 0 && ! this.sourceBuffer.updating) {
                    this.sourceBuffer.appendBuffer( this.queue.shift() );
                }
            });
        }, false);

        this.target.src = URL.createObjectURL( this.mediaSource ) ;
    }

    receiveBuffer( blobData ){
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

    stop(){
        // release/clean all
        this.queue = [];
        this.sourceBuffer = null ;
        this.mediaSource = null ;
    }

}