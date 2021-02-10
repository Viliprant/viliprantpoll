// Set up socket.io
const socket = io('http://localhost:3030');
// Initialize a Feathers app
const app = feathers();

// Register socket.io to talk to our server
app.configure(feathers.socketio(socket));

// const test = app.service('polls').create({
//     title: 'test',
//     questions: [
//         {name: 'Question1'},
//         {name: 'Question2'},
//         {name: 'Question3'},
//     ],
// })