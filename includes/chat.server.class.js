var users = require('./users.class.js'),
		events = require('./events');

class Chat {

	constructor (id, name, io) {
		this.id = id;
		this.members = new users.Users();
		this.connection = io.of(id);
	}

	start() {
		// Since this changes in events, make a reliable reference here.
		var self = this;

		console.log('Spinning up chat: ', this.id);
		self.connection.on('connection', function ioConnectEvent(client) {

	    // When a new client joins, let us know.
	    client.on('join', function joinEvent(data) {
	    	try {
	    	var user = self.members.add(client.id, data);
	    	events.join(client, data, user);
	    	}
	    	catch(err) {
	    		console.warn('While regestering user, encountered error: ', err);
	    	}
	    });

		  client.on('disconnect', function leaveEvent() {
		  	try {
			  	var user = self.members.remove(client.id);
			  	events.disconnect(client, user);
			    console.log('Client ', user.name, '(', client.id ,') disconnected');
			  }
			  catch(err) {
			  	console.warn('Tried to remove a user who doesn\'t exist. Error: ', err);
			  }
		  });

	    client.on('error', function errorEvent(err) {
	    	console.error(err);
	    });

	    // When we recieve a message, broadcast to all.
	    client.on('messages', function broadcastEvent(data) {
		  	var user = self.members.get(client.id);
	    	events.messages(client, data, user);
	    });
		});
	}
}

module.exports = {
	Chat: Chat
};