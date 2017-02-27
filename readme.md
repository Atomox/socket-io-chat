# Socket.io Chatroom Demo
*A test for Socket.io, with Express, Node.js and jQuery*

Just testing to see what Socket.io can do.

## Setup:
1. npm app.js (Does this install requirements)?
2. Include these files in an index.html:
```
        <script src="/jquery/dist/jquery.js"></script>
        <script src="/socket.io/socket.io.js"></script>
        <script src="../chat.client.js"></script>
        <script src="../index.js"></script>
```
3. Index.js is your guy. Init like so:
```
// Target for the chat window.
var screen = jQuery('#future');

// Init the chat module, and join a room/namespace.
my_chat.init('http://localhost', '4200', screen);
my_chat.join('your_chat_namespace');

// Send a message.
my_chat.sendMessage('Hello World.');
```
4. `index.html` has a target element for the chat, and a form with an input for typing:

```
  <ul id="future"></ul>
```