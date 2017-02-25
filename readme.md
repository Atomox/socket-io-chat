# Socket.io Chatroom Demo
*A test for Socket.io, with Express, Node.js and jQuery*

Just testing to see what Socket.io can do.

## Setup:
1. npm app.js (Does this install requirements)?
2. Include these files in an index.html:
```
        <script src="/jquery/dist/jquery.js"></script>
        <script src="/socket.io/socket.io.js"></script>
        <script src="../chat.js"></script>
        <script src="../index.js"></script>
```
3. Index.js is your guy. Init like so:
```
// Some dom elements.
var chat_form = jQuery('form'),
   message_field = jQuery('#chat_input'),
   screen = jQuery('#future');

// Init the chat module.
my_chat.init('http://localhost', '4200', screen);

// When we submit a message, send it.
chat_form.on('submit', function(e) {
   e.preventDefault();
   my_chat.sendMessage(message_field.val());
});
```
4. `index.html` has a target element for the chat, and a form with an input for typing:

```
        <ul id="future"></ul>
        <form id="form" id="chat_form">
            <input id="chat_input" type="text">
            <input type="submit" value="Send">
        </form>
```