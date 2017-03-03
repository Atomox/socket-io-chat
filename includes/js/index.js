// Some elements.
var chat_form = jQuery('#chat_form'),
   room_menu = jQuery('#rooms'),
   room_menu_item = jQuery('#rooms'),
   message_field = jQuery('#chat_input'),
   screen = jQuery('#future');

// Init the chat module.
my_chat.init('http://localhost', '4200', {
   title: 'RoomName',
   screen: 'future',
   room_count: 'user-count',
   room_list: 'room-list'
});

// Intialize foundation plugins.
jQuery(document).foundation();


// When we submit a message, send it.
chat_form.on('submit', function(e) {
   e.preventDefault();
   my_chat.sendMessage(message_field.val());
   message_field.val('');
});

room_menu_item.on('click', 'li', function(e) {
   e.preventDefault();
   console.log('clicked!');

   if (typeof e.target.attributes[0].value !== 'undefined') {
      console.log('Join: ', e.target.attributes[0].value);
      my_chat.join(e.target.attributes[0].value);
   }
});



// Display current rooms.
updateRooms();

function updateRooms() {
   // Get all rooms.
   my_chat.getRooms()
      .then(function roomsResult(data) {
         displayRooms(room_menu,data);

      }).fail(function roomsFail(err) {
         console.warn(err);
      });
}

function displayRooms(target, rooms) {
   var results = '';
   for (var i =0; i < rooms.length; i++) {
      results += '<li> <a href="' + rooms[i].id + '">' + rooms[i].name + '</a></li>';
   }
   target.html(results);
}