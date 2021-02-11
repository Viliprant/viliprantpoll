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

function createPoll(poll){
    // DOM Elements
    const contentVote = document.getElementById('content-vote');
    const totalVote = document.getElementById('total-vote');

    // TOTAL VOTES
    const nbTotalVotes = poll.questions.reduce((accumulator, currentValue) => {
        return accumulator += parseInt(currentValue.votes);
    }, 0);
    totalVote.textContent = `Total: ${nbTotalVotes}`;

    // CREATE BAR
    for(const {label, votes} of poll.questions){
        const wrapperBar = document.createElement('div');
        wrapperBar.classList.add('vote');

        const percent = nbTotalVotes !== 0 ? Math.ceil((100 * votes) / nbTotalVotes ) : 0;

        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.width = `${percent}%`;

        const wrapperLabel = document.createElement('div');
        wrapperLabel.classList.add('label');
        wrapperLabel.textContent = label;

        const spanVotes = document.createElement('span');
        spanVotes.textContent = `${votes} ${percent}%`;

        wrapperBar.append(bar, wrapperLabel, spanVotes);
        contentVote.append(wrapperBar);
    }
}

function updatePoll(poll){
    // TODO: UPDATE POLL
    // DOM Elements
    const contentVote = document.getElementById('content-vote');
    const totalVote = document.getElementById('total-vote');
    
    // TOTAL VOTES
    const nbTotalVotes = poll.questions.reduce((accumulator, currentValue) => {
        return accumulator += parseInt(currentValue.votes);
    }, 0);
    totalVote.textContent = `Total: ${nbTotalVotes}`;

    
    for (const [key, value] of Object.entries(poll.questions)) {
        const votes = value.votes;
        const label = value.label;
        
        const percent = nbTotalVotes !== 0 ? Math.ceil((100 * votes) / nbTotalVotes ) : 0;
        const wrapperBar = contentVote.childNodes[key];

        const bar = wrapperBar.getElementsByClassName('bar')[0];
        bar.style.width = `${percent}%`;

        const wrapperLabel = wrapperBar.getElementsByClassName('label')[0];
        wrapperLabel.textContent = label;

        const spanVotes = wrapperBar.getElementsByTagName('span')[0];
        spanVotes.textContent = `${votes} ${percent}%`;

    }
}

const main = async () => {
    const poll = await app.service('polls').get(getPollId());
    console.log(poll);

    createPoll(poll);

    app.service('polls').on('updated', updatePoll);
    // setInterval(async () => {
    //     poll.questions[0].votes = Math.floor(Math.random() * Math.floor(100));
    //     poll.questions[1].votes = Math.floor(Math.random() * Math.floor(100));
    //     poll.questions[2].votes = Math.floor(Math.random() * Math.floor(100));
    //     await app.service('polls').update(poll._id, poll);
    // }, 1000)
  };
  
  main();

// const test = app.service('polls').create({
//     title: 'test',
//     questions: [
//         {label: 'Question1'},
//         {label: 'Question2'},
//         {label: 'Question3'},
//     ],
// })