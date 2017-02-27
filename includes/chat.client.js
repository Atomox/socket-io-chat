var my_chat = (function() {

	// Our socket connection, and our user object.
	var socket = null,
			host = '',
			port = '',
			myself = false,
			screen_element = false;

	/**
	 * Initialization of the chat.
	 *
	 * @param  {string} host
	 *   Host, with protocol.
	 * @param  {int} port
	 *   The port our host is listening on.
	 */
	function init(target_host, target_port, screen_elem) {
		host = target_host;
		port = target_port;

		// The target "Screen" element.
		screen_element = screen_elem;
	}


	/**
	 * Join a new chatroom/socket namespace.
	 *
	 * @param  {string} room
	 *   A namespace of a socket / room.
	 */
	function join(room) {
		if (typeof room === 'string' && room.length > 0) {
			socket = io.connect(host + ':' + port + '/' + room);

			socket.on('connect', function(data) {
			   socket.emit('join', 'Hello World from client');
			});

			socket.on('broad', function(data) {
			   route_message(data);
			});
		}
		else {
			console.log('Requested room to join was invalid.');
		}
	}


	/**
	 * Leave a room / disconnect.
	 */
	function leave() {
		/**
		   @TODO
		 */
		if (typeof socket !== null) {
			socket.disconnect();
		}
	}


	/**
	 * Handle any incoming messages.
	 *
	 * @param  {object} data
	 *   Data from the server.
	 */
	function route_message(data) {
		if (typeof data === 'object' && data !== null) {

			// Your join ID alert.
      if (data.type == 'id') {
         myself = data.data;
      }
      // A join or left alert.
      else if (data.type == 'join' || data.type == 'left') {
      	show_alert(data.type, data.uid, data.user);
      }
      // General messages.
      else {
        show_message('', data.uid, data.user, data.message);
      }
   	}
	}


	/**
	 * Display an alert instead of a message.
	 *
	 * @param  {string} type
	 *   The type of message.
	 * @param  {int} uid
	 *   The user ID sending the message.
	 * @param  {string} user
	 *   The name of the user sending the message.
	 * @param  {string} message
	 *   The actual message.
	 */
	function show_alert(type, uid, user, message) {
		var this_user = '<span class="person">' + user + '</span>',
				who = is_this_me(uid) ? 'You'	: this_user;

		if (type == 'join') {
			var what = is_this_me(uid)
				? 'joined the room as ' + this_user
				: 'joined the room.';
		}
		else if (type == 'left') {
			var what = 'left the room.';
		}

		screen_element.append('<li>' + who + ' ' + what + '</li>');
	}


	/**
	 * Display a message.
	 *
	 * @param  {string} type
	 *   The type of message.
	 * @param  {int} uid
	 *   The user ID sending the message.
	 * @param  {string} user
	 *   The name of the user sending the message.
	 * @param  {string} message
	 *   The actual message.
	 */
	function show_message(type, uid, user, message) {

	   var user = is_this_me(uid)
	      ? '<b>' + user + '</b>: '
	      : '<i>' + user + '</i>: ';

	   var line = '<li>' + user + message + '</li>';
	   screen_element.append(line);
	}

	/**
	 * Send a message to the server.
	 *
	 * @param  {mixed} data
	 *   The message/data to send.
	 */
	function send_message(data) {
		var message = $('#chat_input').val(),
      user = $('#username').val();

   	if (typeof user === 'undefined' || user == '') {
      user = "Mysterious Mouse";
   	}

   	socket.emit('messages', {message: message});
	}


	/**
	 * What's my name?
	 *
	 * @return {string}
	 *   My current name.
	 */
	function who_am_i() {
		return (typeof myself.name !== 'undefined') ? myself.name : false;
	}


	/**
	 * Is this uid me?
	 *
	 * @param {int} uid
	 *   A user ID to check.
	 *
	 * @return {boolean}
	 *   true if this is me.
	 */
	function is_this_me (uid) {
		return (uid === myself.uid) ? true : false;
	}


	return {
		init: init,
		join: join,
		whoAmI: who_am_i,
		showMessage: show_message,
		sendMessage: send_message
	};
})();
