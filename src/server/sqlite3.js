const Sqlite3= require("sqlite3");
const util = require('./util')

class Sqlite3DataBase {

    db ; // Sqlite Database

    constructor(dbFilePath) {
        if( ! this.db )
        this.db = new Sqlite3.Database( dbFilePath , (error) => {
            if (error) {
                return console.error(error.message);
            }
        });
    }
}

class AppSqlite extends Sqlite3DataBase {

    constructor() {
        super("./sockets.db");
        //create sessions table
        let co = "ssid VARCHAR(100) , io VARCHAR(100) , listening VARCHAR(100) , init VARCHAR(50)" ;
        let ct = "CREATE TABLE IF NOT EXISTS `sockets`( " + co + " );";
        this.db.exec( ct );
        this.removeExpiredSockets();
    }

    addSocket(sessionId, socketId , listenChannel , callback ) {

        listenChannel = listenChannel !== null ? listenChannel : '-';

        let init = util.getUIDStamp( sessionId ); // stamp

        let exist = `SELECT * FROM sockets WHERE ssid='${sessionId}' OR io='${socketId}'` ;
        this.db.get( exist , ( err , raw ) => {
            //console.log( "new : " + sessionId + " | " + socketId );
            if( !raw ){ // Not Found
                console.log( "adding new raw : " , sessionId + " | " + socketId + " | " + listenChannel );
                let sql = "INSERT INTO sockets( 'ssid' , 'io' , 'listening' , 'init' )";
                sql += ` VALUES ( '${sessionId}' , '${socketId}' , '${listenChannel}' , '${init}' );` ;
                this.db.exec( sql , () => callback && callback() );
            } else { // Exists!
                //console.log( "old : " + raw.ssid + " | " + raw.io );
                if( raw.io === socketId && raw.ssid !== sessionId )
                    // Some One Else Using This SocketId
                    this.destroySocket( raw.ssid ,
                        () => this.addSocket( sessionId ,socketId ,listenChannel , callback ) );
                else if( raw.io !== socketId && raw.ssid === sessionId )
                    // Some One Else Using This SocketId
                    this.destroySocket( raw.ssid ,
                        () => this.addSocket( sessionId ,socketId ,listenChannel , callback ) );
                else if( raw.listening !== listenChannel ){
                    // console.log( "difference : " , raw.toLocaleString() , listenChannel  )
                    // Some One Else Using This SocketId
                    this.destroySocket( raw.ssid ,
                        () => this.addSocket( sessionId ,socketId ,listenChannel , callback ) );
                }
                /** :)
                else if( row.io === socketId && row.ssid === sessionId )
                    // Some One Else Using This SocketId
                    this.destroySocket( row.ssid ,
                        () => this.addSocket( sessionId ,socketId ) );*/
            }
        });

    }

    getSocket(sessionId, callback) {
        let query = `SELECT * FROM sockets WHERE ssid='${sessionId}'` ;
        this.db.get( query , ( err , row ) => {
            if( err || !row ){
                //console.log( "Get Error : " + err );
                callback( null );
            } else {
                //console.log( row.data );
                callback( row ) ;
            }
        });
    }

    getSocketByPartial( sessionPartial , callback ){
        let query = `SELECT * FROM sockets WHERE ssid LIKE '%${sessionPartial}%'` ;
        this.db.get( query , ( err , row ) => {
            if( err || !row ){
                //console.log( "Get Error : " + err );
                callback( null );
            } else {
                //console.log( row.data );
                callback( row ) ;
            }
        });
    }

    getSocketListeners( channelId , callback ){
        let query = `SELECT * FROM sockets WHERE listening='${channelId}'` ;
        this.db.all( query , ( err , rows ) => {
            if( err || !rows ){
                //console.log( "Get Error : " + err );
                callback( null );
            } else {
                //console.log( row.data );
                callback( rows ) ;
            }
        });
    }

    destroySocket(sessionId, callback) {
        let sql = `DELETE FROM sockets WHERE ssid='${sessionId}'` ;
        //console.log( "delete sql : " + sessionId );
        this.db.exec( sql , () => callback && callback() );
    }

    removeExpiredSockets() {
        // clear 24h old sessions
        const time = Date.now() - 24 * 3600 ;
        this.db.exec( `DELETE FROM sockets WHERE ${time} > init` );
    }

}

module.exports = new AppSqlite() ;