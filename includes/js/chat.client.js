var my_chat = (function() {

	// Our socket connection, and our user object.
	var socket = null,
			host = '',
			port = '',
			myself = false,
			screen_element = false,
			title_element = false,
			room_count = false,
			room_list = false;

	/**
	 * Initialization of the chat.
	 *
	 * @param  {string} host
	 *   Host, with protocol.
	 * @param  {int} port
	 *   The port our host is listening on.
	 */
	function init(target_host, target_port, elements) {
		host = target_host;
		port = target_port;

		if (elements.screen) {
			// The target "Screen" element.
			screen_element = jQuery('#' + elements.screen);
		}
		if (elements.title) {
			title_element = jQuery('#' + elements.title);
		}
		if (elements.room_count) {
			room_count = jQuery('#' + elements.room_count);
		}
		if (elements.room_list) {
			room_list = jQuery('#' + elements.room_list);
		}
	}


	function getRooms() {

		var getRoom = jQuery.Deferred();

		// URL where our acceptance lives.
    var url = 'http://' + window.location.host + '/chat/roomlist';

		ajaxStandardPromise({
			  type: "GET",
        url: url,
        dataType: "json"
		}).then(function completeAjax(data, status) {
			console.log('result', data);
      getRoom.resolve(data);

		}).fail(function failAjax(xhr,status,err) {
			console.warn(err);
      getRoom.reject(err);
		});

		return getRoom;
	}


	/**
	 * Join a new chatroom/socket namespace.
	 *
	 * @param  {string} room
	 *   A namespace of a socket / room.
	 */
	function join(room) {
		if (typeof room === 'string' && room.length > 0) {
			if(room.substring(0,1) === '/') {
				room = room.substring(1);
			}
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

	function updateChatScroll() {
    screen_element.scrollTop(screen_element[0].scrollHeight);
		console.log('Scroll height:', screen_element[0].scrollHeight);
	}


	function updateRoomStats(info) {
		var count = info.users.length;
		console.log(count, 'users in room');
		title_element.text(info.name);
		room_count.text(count);
	}


	function updateChat(info) {
		updateChatScroll();
		if (typeof info !== 'undefined' && info !== null) {
			updateRoomStats(info);
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

			console.log('Message for you sir', data);

			// Your join ID alert.
      if (data.type == 'id') {
         myself = data.data;
      }
      // A join or left alert.
      else if (data.type == 'join' || data.type == 'left') {
      	show_alert(data.type, data.uid, data.user);
      	updateChat(data.data.room);
      }
      // General messages.
      else {
        show_message('', data.uid, data.user, data.message);
      	updateChat(data.data.room);
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
		var this_user = message_component_user(user, uid),
				who = is_this_me(uid) ? 'You'	: this_user;

		if (type == 'join') {
			var what = is_this_me(uid)
				? 'joined the room as ' + this_user
				: 'joined the room.';
		}
		else if (type == 'left') {
			var what = 'left the room.';
		}

		screen_element.append('<div class="row alert"><div class="small-12 column">' + who + ' ' + what + '</div></div>');
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
	function show_message(type, uid, user, message, icon) {

	   var user = message_component_user(user, uid);

	   if (!icon) {
	   	icon = '<span class="fa-stack fa-lg">'
  				+ '<i class="fa fa-square-o fa-stack-2x"></i>'
  				+ '<i class="fa fa-user-o fa-stack-1x"></i>'
					+ '</span>';
	   }

	   var line = '<div class="row"><div class="small-2 medium-1 column">'
	   	+ icon + '</div>'
	   	+ '<div class="small-10 medium-11 column">'
	   	+ user + '<br/>'
	   	+ message + '</div></div>';
	   screen_element.append(line);
	}


	function message_component_user(user, uid) {
		return is_this_me(uid)
	      ? '<span class="user self">' + user + '</span>'
	      : '<span class="user">' + user + '</span>';
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


  /**
   * jQuery Ajax function, wrapped in a standard promise.
   *
   * @param {object} settings
   *   Standard settings passed to jQuery.ajax().
   *
   * @return {Promise}
   *   Standard promise, where resolve() is passed contents of .done().
   */
  function ajaxStandardPromise(settings) {

    // Use a promise to handle errors outside of ajax's own promise.
    var myPromise = jQuery.Deferred();

    // Wrap the AJAX with a standard promise,
    // for more unform results.
    jQuery.ajax(settings)
      .done(function ajaxDone(data, status) {
        myPromise.resolve(data, status);
      })
      .fail(function ajaxFail(jqXHR, status, err) {
        myPromise.reject(jqXHR, status, err);
      });

    return myPromise;
  }


	return {
		init: init,
		join: join,
		whoAmI: who_am_i,
		showMessage: show_message,
		sendMessage: send_message,
		getRooms: getRooms
	};
})();
