var webpack = require("webpack");
var path = require('path');

module.exports = {
	target: 'node' ,
	entry: {
	    server: path.resolve(__dirname, "./server.js" ),
  	},
	output: {
	    path: path.resolve(__dirname, './dist'),
	    filename: 'server.js',
    	publicPath: "dist"
  	},
  	devServer : {
  		/*devMiddleware: { 
  			writeToDisk: true 
  		} ,
  		static: './' ,
  		port : 3000*/
  	} ,
	module: {
	    rules: [
	      	{ // for JS
		        test: /\.js$|\.jsx$/,
		        exclude: /node_modules/,
		        use: ['babel-loader']
	      	} , { // for Styles
	      		test : /\.css$/ ,
	      		use: ['style-loader' , 'css-loader' ]
	      	} , { // for Styles/Sass
	      		test : /\.scss$/ ,
	      		use: ['style-loader' , 'css-loader' , 'sass-loader' ]
	      	} 
	    ]
	},
	//mode: 'production'  // Slow In Development -> Small File In Finish
	mode: 'development' // Fase In Development -> Big File In Development!
}