const { createServer } = require('node:http');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
const root = __dirname ;
const pa = require('path');
const fs = require('fs');

const server = createServer((req, res) => {

	let url = req.url ;

	if( url === "/" ){
	  	res.statusCode = 200;
	 	res.setHeader('Content-Type', 'text/html');
		res.write( fs.readFileSync( pa.join( root , "index.html" ) ) );
		res.end();
	} else {
		let ext = pa.extname( url );
		let mat = {
			".css" 	: "text/css" ,
			".js" 	: "text/javascript" ,
			".png" 	: "image/png" ,
			".jpg" 	: "image/jpg" ,
			".jpeg" : "image/jpeg" ,
			".svg"  : "image/svg+xml" ,
			".mp3" 	: "audio/mp3" ,
			".mp4" 	: "video/mp4" ,
		}; let mime = "" ;
		for( let exn in mat ){
			if( exn === ext )
				mime = mat[exn] ;
		} if( mime !== "" ){
			res.setHeader('Content-Type', mime );
			if( mime.indexOf( "audio" ) >= 0 || mime.indexOf( "video" ) >= 0 ){
				// Video And Audio Range Handling
				let file = pa.join( root , url );
				fs.stat(file, function(err, stats) {
					if (err) {
						if (err.code === 'ENOENT') {
							// 404 Error if file not found
							return res.sendStatus(404);
						}
						return res.end(err);
					}

					let range = req.headers.range;
					if (!range) {
						// 416 Wrong range
						return res.statusCode(416);
					}

					var positions = range.replace(/bytes=/, "").split("-");
					var start = parseInt(positions[0], 10);
					var total = stats.size;
					var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
					var chunksize = (end - start) + 1;

					res.setHeader("Content-Range", "bytes " + start + "-" + end + "/" + total);
					res.setHeader("Accept-Ranges", "bytes");
					res.setHeader("Content-Length", chunksize);

					var stream = fs.createReadStream(file, {start: start, end: end})
						.on("open", function () {
							stream.pipe(res);
						}).on("error", function (err) {
							res.end(err);
						});
				});
				return;
			} res.write( fs.readFileSync( pa.join( root , url ) ) );
			res.end();
		} else {
			res.setHeader('Content-Type', "text/html" );
			res.end( '404 : File Not Found - OR - Mime Not Listed' );
		}
	}

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});