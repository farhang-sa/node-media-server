var nodemon  = require('nodemon');
var { exec } = require('child_process');

nodemon({
  	script: 'server.js',
  	ext: 'js jsx ts tsx html json css scss' ,
  	ignore : [
	    ".git",
		"./nodemon.js",
		"./server.js",
		//"./socket-server.js",
		"./webpack.config.js",
		"./dist/server.js" ,
	    "./dist/scripts/app.bundle.js" ,
		"./dist/*" ,
	  ]
});

// WebPack Compile-Transpile Command for dev
let cmd = "webpack --mode development -c webpack.config.js webpack.config.server.js";

nodemon.on('start', function () {
	// Execute WebPack Compile 
    exec( cmd , (err, stdout, stderr) => {});
  	console.log('> Nodemon has started');
}).on('quit', function () {
  	console.log('> Nodemon has quit');
  	process.exit();
}).on('restart', function (files) {
  	console.log('> Nodemon restarted due to change(s): ', files);
});