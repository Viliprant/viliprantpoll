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

let copiedInterval;
function copyToClipboard(DOMElement) {
    var range = document.createRange();
    range.selectNode(DOMElement);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");

    DOMElement.classList.add("copied");
    window.clearInterval(copiedInterval);
    copiedInterval = window.setInterval(() => showCopiedLabel(DOMElement), 5001);
}

function showCopiedLabel(DOMElement){
    DOMElement.classList.remove("copied");
}

const main = async () => {
    let pollData;
    const shareLink = document.getElementById('share-link');
    const linkWrapper = document.getElementById('link-wrapper');

    try{
        pollData = await app.service('polls').get(getPollId());
    }
    catch(err){
        if(err.code === 400 || err.code === 404){
            window.location.replace(window.location.origin);
        }
    }

    const path = `${window.location.origin}/poll?poll=${pollData._id}`;
    shareLink.textContent = path;
    shareLink.href = path;

    linkWrapper.addEventListener('click', (evt) => {
        evt.preventDefault();
        copyToClipboard(shareLink)
    });

    const poll = new Poll(pollData, app);

    poll.createDOMPoll(poll);

    app.service('polls').on('updated', (data) => poll.updateDOMPoll(data));
  };
  
  main();