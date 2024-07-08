## Node Media Server
this app is a demonstration of broadcasting media over socket & WebRTC p2p calling. 
running build will generate two files ./dist/server.js and ./dist/scripts/app.bundle.js and you can simply run <code>node ./dist/server.js</code> to start.
### note : in radio and tv , you must listen to a channel in another device/browser then start hosting in primary.

## Node Socket Server
1. Online Radio & Tv
2. WebRTC peer2peer Calls

## requirements 
1. nodejs v18
2. nodemon ( <code>npm i -g nodemon</code> )
3. webpack ( <code>npm i -g webpack</code> )

## installing
1. clone <code>git clone https://github.cpm/farhang-sa/node-media-server</code>
2. install <code>npm install</code>
3. edit <code>./src/hostPort.js</code> and put your own hostname & port
4. build <code>npm run build</code>
5. start <code>npm start</code>
