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
    if(urlParams.get('poll') == null){
        window.location.replace(window.location.origin);
    }
    return urlParams.get('poll');
}

const main = async () => {
    let pollData;
    try{
        pollData = await app.service('polls').get(getPollId());
    }
    catch(err){
        if(err.code === 400 || err.code === 404){
            window.location.replace(window.location.origin);
        }
    }

    const poll = new Poll(pollData, app);

    poll.createDOMPoll(poll);

    app.service('polls').on('updated', (data) => poll.updateDOMPoll(data));
  };
  
  main();