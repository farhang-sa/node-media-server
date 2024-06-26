import React from 'react' ;
import { render } from 'react-dom' ;
import $ from 'jquery' ;

window.React = React;
window.$ = $ ;

render(
	<div className="bg-info text-center" style={{height:250}}>
		React Dom Rendering :) 
		<br /> You Can Start Developing Now :))
	</div> , 
document.getElementById( 'app-view' ) );