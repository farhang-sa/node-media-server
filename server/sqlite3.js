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
        let co = "ssid VARCHAR(100) , io VARCHAR(100) , init VARCHAR(50)" ;
        let ct = "CREATE TABLE IF NOT EXISTS `sockets`( " + co + " );";
        this.db.exec( ct );
        this.removeExpiredSockets();
    }

    addSocket(sessionId, socketId , callback ) {

        let init = util.getUIDStamp( sessionId ); // stamp

        let exist = `SELECT * FROM sockets WHERE ssid='${sessionId}' OR io='${socketId}'` ;
        this.db.get( exist , ( err , row ) => {
            if( !row ){ // Not Found
                let sql = "INSERT INTO sessions( 'ssid' , 'io' , 'init' )";
                sql += `VALUES ( '${sessionId}' , '${socketId}' , '${init}' );` ;
                this.db.exec( sql , () => callback && callback() );
            } else { // Exists!
                if( row.io === socketId && row.ssid !== sessionId )
                    // Some One Else Using This SocketId
                    this.destroySocket( row.ssid ,
                        () => this.addSocket( sessionId ,socketId ) );
                else if( row.io === socketId && row.ssid === sessionId )
                    // Some One Else Using This SocketId
                    this.destroySocket( row.ssid ,
                        () => this.addSocket( sessionId ,socketId ) );
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

    destroySocket(sessionId, callback) {
        this.db.exec( `DELETE FROM sockets WHERE ssid='${sessionId}'` , () => callback && callback() );
    }

    removeExpiredSockets() {
        // clear 24h old sessions
        const time = Date.now() - 24 * 3600 ;
        this.db.exec( `DELETE FROM sockets WHERE ${time} > init` );
    }

}

module.exports = new AppSqlite() ;