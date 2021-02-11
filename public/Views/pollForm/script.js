// Set up socket.io
const socket = io('http://localhost:3030');
// Initialize a Feathers app
const app = feathers();

// Register socket.io to talk to our server
app.configure(feathers.socketio(socket));

const plusIcon = document.getElementById('plus-icon');
const pollForm = document.getElementById('pollForm');

function addResponseField(evt){
    evt.preventDefault();
    
    const responsesWrapper = document.getElementById('responses');

    const newResponseInput = document.createElement('input');
    newResponseInput.type = 'text';
    newResponseInput.classList.add('response')
    newResponseInput.name = `response${responsesWrapper.childElementCount}`;

    responsesWrapper.appendChild(newResponseInput);
}

function submitPollForm(evt){
    evt.preventDefault();
    
    const dataToSend = getInfosFromForm(evt);

    const isValid = checkData(dataToSend);

    if(isValid)
    {
        app.service('polls').create(dataToSend);
    }
    else{
        // TODO: Generate error on the view
        console.error('Wrong Data');
    }
}

function checkData(data){
    if(data.title === '') return false;
    if(data.questions.length < 2) return false;
    return true;
}

function getInfosFromForm(evt){
    const pollForm = evt.currentTarget;
    const pollFormData = new FormData(pollForm);
    let dataToSend = {
        title: pollFormData.get('title') || ''
    };
    let questions = []

    for (const key of pollFormData.keys()) {
        if(key !== 'title' && pollFormData.get(key) !== "")
        {
            questions.push(
                {label: pollFormData.get(key)}
            )
        }
    }
    dataToSend = {
        ...dataToSend,
        questions,
    }
    
    return dataToSend;
}

plusIcon.addEventListener('click', addResponseField)
pollForm.addEventListener('submit', submitPollForm)