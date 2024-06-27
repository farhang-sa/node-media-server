import React from 'react' ;
import {createRoot} from "react-dom/client";
import {HashRouter , Route , Routes } from "react-router-dom";
import {io} from "socket.io-client";
import $ from 'jquery' ;

import '../styles/app.css' ;
import Nav from "./nav.jsx";
import HomePage from "./home.jsx";
import SocketTV from "./socket-tv/tv.jsx";
import SocketRadio from "./socket-radio/radio.jsx";
import P2PVideo from "./p2p-video/p2pVideo.jsx";
import P2PVoice from "./p2p-voice/p2pVoice.jsx";
import {P2PContextProvider} from "./components/p2pContext";
import {IOContextProvider} from "./components/ioContext";

import {hostname, port} from "./components/hostPort";

window.$ = $ ;
window.React = React;
window.getMySid = () => {
	let cookies = document.cookie.split(';');
	for( let i = 0; i < cookies.length ; i++ ){
		let cookie = decodeURIComponent( cookies[i] );
		let spl = cookie.split( "=" );
		if( spl[0] === "sid" )
			return cookie.replace( "sid=" , "" );
	} return null ;
}
window.getNumber = () => {
	let sid = window.getMySid();
	sid = sid.split( "_" );
	return sid[1] ;
}
window.socket = io(hostname + ':' + port );

const SocketRadioRoute = () =>
	<IOContextProvider>
		<SocketRadio />
	</IOContextProvider>

const SocketTvRoute = () =>
	<IOContextProvider>
		<SocketTV />
	</IOContextProvider>

const root = createRoot( document.getElementById( 'app-view' ) );
root.render(
	<P2PContextProvider>
		<HashRouter basename={window.baseName}>
			<Nav />
			<div className="p-3">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/socket-radio" element={<SocketRadioRoute />} />
					<Route path="/socket-tv" element={<SocketTvRoute />} />
					<Route path="/p2p-voice" element={<P2PVoice />} />
					<Route path="/p2p-video" element={<P2PVideo />} />
				</Routes>
			</div>
		</HashRouter>
	</P2PContextProvider>
 );