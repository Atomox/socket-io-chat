// Some elements.
var chat_form = jQuery('#chat_form'),
   room_select_form = jQuery('#room_select'),
   room_field = jQuery('#room'),
   message_field = jQuery('#chat_input'),
   screen = jQuery('#future');

// Init the chat module.
my_chat.init('http://localhost', '4200', screen);



// When we submit a message, send it.
chat_form.on('submit', function(e) {
   e.preventDefault();
   my_chat.sendMessage(message_field.val());
   message_field.val('');
});

room_select_form.on('submit', function(e) {
   e.preventDefault();
   my_chat.join(room_field.val());
});


