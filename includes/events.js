
/**
 * Perform during a join.
 *
 * @param  {IO client} client
 *   Client passed on a connection event.
 * @param  {mixed} data
 *   Any data passed on a join.
 */
function join_event(client, data, user) {
  var send_user = format_message(client, user, 'id'),
  		join_alert = format_message(client, user, 'join', user.name + 'joined the room');

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
function disconnect_event(client, user) {
	var left_alert = format_message(client, user, 'left', user.name + 'left the room');
	client.broadcast.emit('broad', left_alert);
}


/**
 * Perform during a messages.
 *
 * @param  {IO client} client
 *   Client passed on a connection event.
 */
function messages_event(client, data, user) {
	// Prepare the message format.
	var msg = format_message(client, user, 'message', data.message);

	// Broadcast back to the user, then to everyone else.
	client.emit('broad', msg);
	client.broadcast.emit('broad', msg);
}


/**
 * Format a message.
 */
function format_message(client, user, type, message, data) {
	var result = {};

	if (type == 'message' || type == 'alert' || type == 'join' || type == 'left') {
    result.user = user.name;
    result.uid = user.uid;
		result.message = message;
		result.type = type;
	}
	else if (type == 'id') {
		result = {
    	type: 'id',
    	data: {
    		uid: user.uid,
    		name: user.name
    	}
    };
	}

	return result;
}


module.exports = {
	messages: messages_event,
	disconnect: disconnect_event,
	join: join_event
};