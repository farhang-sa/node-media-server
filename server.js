// imports
const https = require( 'https' );
const socket = require( 'socket.io' )
const Sqlite3 = require("sqlite3");
const expressClass = require( 'express' );
const cors = require( 'cors' );
const Sessions = require( 'express-session' );
const sqliteStoreFactory = require( 'express-session-sqlite' ).default ;

const util = require( "./server/util" );
const AppSqlite = require( "./server/sqlite3" );

// Variables
const hostname = process.env.IP
    || '192.168.1.5' ; // IP On My Home Network
    //|| '192.168.99.174' ; // IP On My Phone Hotspot
const port = process.env.PORT || 3000;
const path = require( 'path' );
const fs = require( 'fs' );
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
express.post( '/io', (req, res) => {
    express.initUser( req , res );
    AppSqlite.addSocket( req.session.id , req.body.io , () => {
        res.json({
            "message" : "welcome : " + req.session.id ,
            "socket" : req.body.io
        });
    });
});
express.get( '/io', (req, res) => {
    express.initUser( req , res );
    AppSqlite.getSocket( req.session.id , (  socketRow ) => {
        if( !socketRow ){
            res.json({
                "failed" : 1
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
 * so we will create HTTPS server ( NOT HTTP )
 **/

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
        origin: hostname , // Only answer to this origin :)
        methods: ["GET", "POST", "DELETE"]
    }
});

// Socket server magic :)
ioServer.on( "connection" , (socket) => {

    socket.on( "setSessionId" , ({ sid }) => {
        // find my session - add/update
        AppSqlite.addSocket( sid , socket.id , () => {});
        // send back my new socket id
        socket.emit( "setSocketId" , socket.id );
        console.log( "new record : " + socket.id + " | " + sid );
    });

    socket.on( "getContactIO" , ({ cid }) => {
        AppSqlite.getSocketByPartial( cid , ( raw ) => {
            if( raw ){ // Contact is online
                socket.emit( "foundContactIO" , raw.io );
            } else { // No contact found
                socket.emit( "noContactIO" , cid );
            }
        });
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    });
    socket.on("callUser", ({ userToCall, signalData, from, name , number }) => {
        ioServer.to(userToCall).emit("callReceive", { signal: signalData, from , number , callerName : name });
    });
    socket.on("answerCall", ({ signal , to , name , number , from }) => {
        ioServer.to(to).emit("callAccepted", { signal , from , cNumber : number , cName : name });
    });
});

server.listen(port, hostname, () => {
    console.log(`HTTPS-Server running at https://${hostname}:${port}/`);
});