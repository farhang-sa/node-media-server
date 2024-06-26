// imports
const https = require( 'https' );
const socket = require( 'socket.io' )
const path = require( 'path' );
const fs = require( 'fs' );
const expressClass = require( 'express' );
const cors = require( 'cors' );

const root = __dirname ;
const hostname = process.env.IP
    || '192.168.99.174' ; //'192.168.1.5'; // My Laptop On My Home Network
const port = process.env.PORT || 3000;

/*
	Note :
	Camera & Mic permissions only work when we are secure ( HTTPS )
	so we will create HTTPS server ( NOT HTTP )
*/

// HTTPS Cert & Key created according to this answer on Stackoverflow :
// https://stackoverflow.com/questions/23001643/how-to-use-https-with-node-js
let httpsOptions = {
    key  : fs.readFileSync( path.join( root , 'server-key.pem') ) ,
    cert : fs.readFileSync( path.join( root , 'server-crt.pem') )
};

// Create Express server middleware
const express = expressClass();
express.use( cors() );
express.use( "/dist" , expressClass.static( path.join( root , "/dist" ) ) );
express.get('/', (req, res) => {
    res.sendFile( path.join( root , './dist/index.html' ) );
});

// Create HTTPS server ( uses express as middleware )
const server = https.createServer( httpsOptions , express );

// Create socket server with Cross-Origin options
const ioServer = socket( server , {
    cors: {
        origin: hostname , // Only answer to this origin :)
        methods: ["GET", "POST", "DELETE"]
    }
});

// this is the socket server
ioServer.on("connection", (socket) => {
    socket.emit("me", socket.id);
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    });
    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        ioServer.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });
    socket.on("answerCall", (data) => {
        ioServer.to(data.to).emit("callAccepted", data.signal)
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at https://${hostname}:${port}/`);
});