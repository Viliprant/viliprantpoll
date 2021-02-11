const socket = io('http://localhost:3030');

const app = feathers();

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

async function submitPollForm(evt){
    evt.preventDefault();
    
    const dataToSend = getInfosFromForm(evt);

    const isValid = checkData(dataToSend);

    if(isValid)
    {
        const newPoll = await app.service('polls').create(dataToSend);
        window.location.replace(`${window.location.origin}/poll?poll=${newPoll._id}`)
    }
    else{
        // TODO: Generate error on the view
        console.error('Must have a title and minimum 2 responses');
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