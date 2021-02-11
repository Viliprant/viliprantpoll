import Poll from '../../Models/Poll.js';

// Set up socket.io
const socket = io('http://localhost:3030');
// Initialize a Feathers app
const app = feathers();

// Register socket.io to talk to our server
app.configure(feathers.socketio(socket));

function getPollId(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('poll');
}

const main = async () => {
    const pollData = await app.service('polls').get(getPollId());
    const poll = new Poll(pollData);

    console.log(poll);

    poll.createDOMPoll(poll);

    app.service('polls').on('updated', (data) => poll.updateDOMPoll(data));
    // setInterval(async () => {
    //     poll.questions[0].votes = Math.floor(Math.random() * Math.floor(100));
    //     poll.questions[1].votes = Math.floor(Math.random() * Math.floor(100));
    //     poll.questions[2].votes = Math.floor(Math.random() * Math.floor(100));
    //     await app.service('polls').update(poll._id, poll);
    // }, 1000)
  };
  
  main();