import React from 'react' ;
import {createRoot} from "react-dom/client";
import { HashRouter, Route, Routes} from "react-router-dom";
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
import {AppContextProvider} from "./components/appContext";

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

const root = createRoot( document.getElementById( 'app-view' ) );

/* Context Provider Solution 1 : wont show render!
const IOBRouter = createHashRouter([
	<Route path="/socket-radio" element={<SocketRadio />} /> ,
	<Route path="/socket-tv" element={<SocketTV />} /> ,
]);

const P2PRouter = createHashRouter([
	<Route path="/" element={ HomePage }  /> ,
	<Route path="/p2p-voice" element={<P2PVoice />} /> ,
	<Route path="/p2p-video" element={<P2PVideo />} />
]);

root.render(
	<>
		<P2PContextProvider router={P2PRouter} />
		<IOBContextProvider router={IOBRouter} />
	</>
);*/

/* Context Provider Solution 2 : works find!
root.render(
	<P2PContextProvider>
		<IOBContextProvider>
			<HashRouter basename={window.baseName}>
				<Header />
				<div className="p-2" style={{minHeight:250}}>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/socket-radio" element={<SocketRadio />} />
					<Route path="/socket-tv" element={<SocketTV />} />
					<Route path="/p2p-voice" element={<P2PVoice />} />
					<Route path="/p2p-video" element={<P2PVideo />} />
				</Routes>
				</div>
				<Footer />
			</HashRouter>
		</IOBContextProvider>
	</P2PContextProvider>
 );*/

/* Context Provider Solution 3 : wont work ;
const P2PProviderElement = ({ children }) =>
	<P2PContextProvider>{children}</P2PContextProvider>

const IOBProviderElement = ({ children }) =>
	<IOBContextProvider>{children}</IOBContextProvider>

root.render(
	<HashRouter basename={window.baseName}>
		<Header />
		<div className="p-2" style={{minHeight:250}}>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route element={<IOBProviderElement />}>
					<Route path="/socket-radio" element={<SocketRadio />} />
					<Route path="/socket-tv" element={<SocketTV />} />
				</Route>
				<Route element={<P2PProviderElement />}>
					<Route path="/p2p-voice" element={<P2PVoice />} />
					<Route path="/p2p-video" element={<P2PVideo />} />
				</Route>
			</Routes>
		</div>
		<Footer />
	</HashRouter>
); */

root.render(
	<AppContextProvider>
		<HashRouter basename={window.baseName}>
			<Header />
			<div className="p-2" style={{minHeight:250}}>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/socket-radio" element={<SocketRadio />} />
					<Route path="/socket-tv" element={<SocketTV />} />
					<Route path="/p2p-voice" element={<P2PVoice />} />
					<Route path="/p2p-video" element={<P2PVideo />} />
				</Routes>
			</div>
			<Footer />
		</HashRouter>
	</AppContextProvider>
);