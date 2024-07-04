import React from 'react' ;
import {createRoot} from "react-dom/client";
import {HashRouter , Route , Routes } from "react-router-dom";
import {io} from "socket.io-client";
import $ from 'jquery' ;

import '../styles/app.css' ;
import Header from "./header.jsx";
import Footer from "./footer.jsx";
import HomePage from "./home.jsx";
import SocketTV from "./socket-tv/tv.jsx";
import SocketRadio from "./socket-radio/radio.jsx";
import P2PVideo from "./p2p-video/p2pVideo.jsx";
import P2PVoice from "./p2p-voice/p2pVoice.jsx";
import {P2PContextProvider} from "./components/p2pContext";
import {IOBContextProvider} from "./components/iobContext";

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

const IOBContextProvidedRadio = () =>
	<IOBContextProvider>
		<SocketRadio />
	</IOBContextProvider>

const IOBContextProvidedTv = () =>
	<IOBContextProvider>
		<SocketTV />
	</IOBContextProvider>

const P2PContextProvidedVoice = () =>
	<P2PContextProvider>
		<P2PVoice />
	</P2PContextProvider>

const P2PContextProvidedVideo = () =>
	<P2PContextProvider>
		<P2PVideo />
	</P2PContextProvider>


const root = createRoot( document.getElementById( 'app-view' ) );
root.render(
	<HashRouter basename={window.baseName}>
		<Header />
		<div className="p-2" style={{minHeight:250}}>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/socket-radio" element={<IOBContextProvidedRadio />} />
				<Route path="/socket-tv" element={<IOBContextProvidedTv />} />
				<Route path="/p2p-voice" element={<P2PContextProvidedVoice />} />
				<Route path="/p2p-video" element={<P2PContextProvidedVideo />} />
			</Routes>
		</div>
		<Footer />
	</HashRouter>
 );