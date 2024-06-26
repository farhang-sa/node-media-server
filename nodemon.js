var nodemon  = require('nodemon');
var { exec } = require('child_process');

nodemon({
  	script: 'server.js',
  	ext: 'js jsx json css scss' ,
  	ignore : [
	    ".git",
		"./nodemon.js",
		//"./server.js",
		//"./socket-server.js",
		"./webpack.config.js",
		"./dist/*" ,
	    "./dist/scripts/app.bundle.js"
	  ]
});

var cmd = "webpack --mode development"; // WebPack Command

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