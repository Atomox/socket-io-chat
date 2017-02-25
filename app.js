var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var user = require('./includes/user'),
		events = require('./includes/events');

// Serve up includes in node_modules, and app-specific in /includes.
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/includes'));

app.get('/', function(req, resp, next) {
	resp.sendFile(__dirname + '/index.html');
});

server.listen(4200);

io.on('connection', function ioConnectEvent(client) {

    // When a new client joins, let us know.
    client.on('join', function joinEvent(data) {
    	events.join(client, data);
    });

	  client.on('disconnect', function leaveEvent() {
	  	events.disconnect(client);
	    console.log('Client ', client.id, 'disconnected');
	  });

    client.on('error', function errorEvent(err) {
    	console.error(err);
    });

    // When we recieve a message, broadcast to all.
    client.on('messages', function broadcastEvent(data) {
    	events.messages(client, data);
    });
});