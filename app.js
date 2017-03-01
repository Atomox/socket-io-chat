var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var chat = require('./includes/chat.server.class.js');

// Serve up includes in node_modules, and app-specific in /includes.
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/includes'));
app.use(express.static(__dirname + '/includes/theme/foundation'));
app.use(express.static(__dirname + '/includes/theme/foundation/bower_components/foundation-sites/'));

// Routing
app.get('/chat', function(req, resp, next) {
	resp.sendFile(__dirname + '/chat.html');
});

// Listen on this port only.
server.listen(4200);

// Create namespaces for these rooms.
var namespaces = [
	'/chat/1',
	'/chat/2',
	'/chat/3'
];

var nsp = [];

// Spin up instances for each room.
for (i in namespaces) {
	nsp[i] = new chat.Chat(namespaces[i], 'Chatroom ' + i, io);
	nsp[i].start();
}