import React from 'react' ;
import { render } from 'react-dom' ;
import {createRoot} from "react-dom/client";
import $ from 'jquery' ;

window.React = React;
window.$ = $ ;

const root = createRoot( document.getElementById( 'app-view' ) );
root.render(
	<div className="bg-info text-center" style={{height:250}}>
		Node Socket Server
	</div> , 
 );