// imports
const https = require( 'https' );
const socket = require( 'socket.io' )
const Sqlite3 = require("sqlite3");
const expressClass = require( 'express' );
const cors = require( 'cors' );
const Sessions = require( 'express-session' );
const sqliteStoreFactory = require( 'express-session-sqlite' ).default ;

const util = require( "./src/server/util.js" );
const AppSqlite = require( "./src/server/sqlite3.js" );

// Variables
const hostname = process.env.IP
    || '192.168.1.5' ; // IP On My Home Network
    //|| '192.168.99.174' ; // IP On My Phone Hotspot
const port = process.env.PORT || 3000;
const path = require( 'path' );
const fs = require( 'fs' );
const Queue = require("./src/server/queue");
const root = __dirname ;

const SessionsSqliteStore = sqliteStoreFactory( Sessions );
const SessionStore = new SessionsSqliteStore({
    // Database library to use. Any library is fine as long as the API is compatible
    // with sqlite3, such as sqlite3-offline
    driver: Sqlite3.Database,
    // for in-memory database
    // path: ':memory:'
    path: 'sessions.db',
    // Session TTL in milliseconds
    ttl: 30000000 ,
    // (optional) Session id prefix. Default is no prefix.
    prefix: 'sess:',
    // (optional) Adjusts the cleanup timer in milliseconds for deleting expired session rows.
    // Default is 5 minutes.
    cleanupInterval: 30000000
});

// Create Express App
const express = expressClass();

// Cross-Origin Handling
express.use( cors() );

// Session Handling ( express-sessions with custom sqlite3 store )
express.use( Sessions({
    secret:'Node Socket Server' ,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 } ,
    genid : ( req ) => util.generateUID() ,
    store : SessionStore

}));

// static files
express.use( "/dist" , expressClass.static( path.join( root , "/dist" ) ) );

// method for initializing user sessions
express.initUser = ( req , res ) => {
    let ssn = req.session ;

    // Set Id As Cookie
    res.cookie( 'sid', ssn.id );
}

// App Routes
express.get('/', (req, res) => {
    express.initUser( req , res );
    res.sendFile( path.join( root , './dist/index.html' ) );
});

// testing : session id => socket connection id
express.get( '/io', (req, res) => {
    express.initUser( req , res );
    AppSqlite.getSocket( req.session.id , (  socketRow ) => {
        if( !socketRow ){
            res.json({
                "failed" : "no socket entry found for your session"
            });
        } else res.json({
            "message" : "welcome : " + socketRow.ssid ,
            "socket" : socketRow.io
        });
    });
});

/**
 * @Creating-Server
 * Camera & Mic permissions only work when we are secure ( HTTPS )
 * so we will create "HTTPS" server to meet the security requirements
 **/

// more info :
// Certificate & Key created according to this answer on Stackoverflow :
// https://stackoverflow.com/questions/23001643/how-to-use-https-with-node-js
let httpsOptions = {
    key  : fs.readFileSync( path.join( root , 'server-cert.key') ) ,
    cert : fs.readFileSync( path.join( root , 'server-cert.crt') )
};

// Https server ( express as middleware )
const server = https.createServer( httpsOptions , express );

// Socket server with Cross-Origin options
const ioServer = socket( server , {
    cors: {
        origin: hostname , // Only answer to this origin
        methods: ["GET", "POST" ]
    }
});

// Socket server magic :)
ioServer.on( "connection" , (mSocket) => {

    mSocket.on( "setSessionId" , ({ sid }) => {
        // find my session - add/update
        AppSqlite.addSocket( sid , mSocket.id , '-' , () => {});
        // send back my new socket id
        mSocket.emit( "setSocketId" , mSocket.id );
    });

    mSocket.on( "getContactIO" , ({ contactId }) => {
        AppSqlite.getSocketByPartial( contactId , ( raw ) => {
            if( raw ){ // Contact is online
                mSocket.emit( "foundContactIO" , raw.io );
            } else { // No contact found
                mSocket.emit( "noContactIO" , contactId );
            }
        });
    });

    // p2p call functions
    mSocket.on("disconnect", () => {
        mSocket.broadcast.emit("callEnded")
    });
    mSocket.on("callUser", ({ userToCall, signalData, from, name , number }) => {
        ioServer.to(userToCall).emit("callReceive", { signal: signalData, from , number , callerName : name });
    });
    mSocket.on("answerCall", ({ signal , to , name , number , from }) => {
        ioServer.to(to).emit("callAccepted", { signal , from , cNumber : number , cName : name });
    });

    // radio/tv functions
    let queue ;
    mSocket.on( "host_init" , ( sid ) => {
        // create new queue for this user ( host )
        // queue = new Queue();
        // update( remove / add ) socket user's row
        AppSqlite.addSocket( sid , mSocket.id , 'hosting' , () => {});
    });
    mSocket.on( "listener_join" , ({ sid , channel }) => {
        // update( remove / add ) socket user's row
        AppSqlite.addSocket( sid , mSocket.id , channel , () => {});
    });
    mSocket.on("channel_bufferHeader", ({ channel , header }) => {
        //queue.bufferHeader = header ;
        AppSqlite.getSocketListeners( channel , ( rows ) => {
            // send to each listener!
            if( rows ) for( let row in rows ) {
                //console.log( 'streaming header to : ' + rows[row].io );
                mSocket.to(rows[row].io).emit('channel_bufferHeader', { header });
            }
        });
    });
    mSocket.on( "channel_stream" , ({ channel , data }) => {
        AppSqlite.getSocketListeners( channel , ( rows ) => {
            // send to each listener!
            if( rows ) for( let row in rows ){
                //console.log( 'streaming data to : ' + rows[row].io );
                mSocket.to( rows[row].io ).emit( 'channel_stream' , { data });
            }
        });
    });
    mSocket.on( 'listener_leave' , ({ sid }) => {
        // update( remove / add ) socket user's row
        AppSqlite.addSocket( sid , mSocket.id , '-' , () => {});
    });
});

// for streaming radio/tv
express.get("/stream/radio/:channel", (req, res) => {

    // add new listener
    const { id, client } = queue.addClient();
    console.log( "stream radio init" )

    res.set({
        "Content-Type": "audio/mp3" ,
        "Transfer-Encoding": "chunked",
    }).status(200);

    client.pipe( res );

    req.on("close", () => {
        queue.removeClient(id);
    });

});

// for streaming radio/tv
express.get("/stream/tv/:channel", (req, res) => {

    // add new listener
    const { id, client } = queue.addClient();
    console.log( "stream tv init" )

    res.set({
        "Content-Type": "video/mp4" ,
        "Transfer-Encoding": "chunked",
    }).status(200);

    client.pipe( res );

    req.on("close", () => {
        queue.removeClient(id);
    });

});

server.listen(port, hostname, () => {
    console.log(`HTTPS-Server running at https://${hostname}:${port}/`);
});