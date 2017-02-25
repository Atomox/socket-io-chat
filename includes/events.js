var user = user || require('./user');

/**
 * Perform during a join.
 *
 * @param  {IO client} client
 *   Client passed on a connection event.
 * @param  {mixed} data
 *   Any data passed on a join.
 */
function join_event(client, data) {
  var my_self = user.add(client.id, data),
  		send_user = format_message(client, 'id'),
  		join_alert = format_message(client, 'join', my_self.name + 'joined the room');

  // Send the clients id to the client itself,
  // and broadcast a join event to everyone else.
  client.emit('broad', send_user);
	client.emit('broad', join_alert);
	client.broadcast.emit('broad', join_alert);
}


/**
 * Perform during a disconnect.
 *
 * @param  {IO client} client
 *   Client passed on a connection event.
 */
function disconnect_event(client) {
	var my_self = user.get(client.id),
    	left_alert = format_message(client, 'left', my_self.name + 'left the room');

	client.broadcast.emit('broad', left_alert);
}


/**
 * Perform during a messages.
 *
 * @param  {IO client} client
 *   Client passed on a connection event.
 */
function messages_event(client, data) {
	// Prepare the message format.
	var msg = format_message(client, 'message', data.message);

	// Broadcast back to the user, then to everyone else.
	client.emit('broad', msg);
	client.broadcast.emit('broad', msg);
}


/**
 * Format a message.
 */
function format_message(client, type, message, data) {
	var result = {};

	if (type == 'message' || type == 'alert' || type == 'join' || type == 'left') {
    result.user = user.get(client.id).name;
    result.uid = user.get(client.id).uid;
		result.message = message;
		result.type = type;
	}
	else if (type == 'id') {
		result = {
    	type: 'id',
    	data: user.getPublicUser(client.id)
    };
	}

	return result;
}


module.exports = {
	messages: messages_event,
	disconnect: disconnect_event,
	join: join_event
};