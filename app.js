var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var chat = require('./includes/chat.server.class.js');

// Serve up includes in node_modules, and app-specific in /includes.
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/includes'));


app.get('/', function(req, resp, next) {
	resp.sendFile(__dirname + '/index.html');
});

app.get('/chat', function(req, resp, next) {
	resp.sendFile(__dirname + '/chat.html');
});

server.listen(4200);

var namespaces = [
	'/chat/1',
	'/chat/2',
	'/chat/3'
];

var nsp = [];

for (i in namespaces) {
	nsp[i] = new chat.Chat(namespaces[i], 'Chatroom ' + i, io);
	nsp[i].start();
}