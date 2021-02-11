export default class Poll{
    constructor({_id, title, questions}){
        this._id = _id;
        this.title = title;
        this.questions = questions;

        // DOM Elements
        this.contentVoteDOM = document.getElementById('content-vote');
        this.totalVoteDOM = document.getElementById('total-vote');
        this.titleDOM = document.getElementById('title');
    }

    vote(evt){
        evt.preventDefault();
        const id = evt.target.dataset.id;
        this.questions = this.questions.map((question) => {
            if(question._id === id) {
                question.votes ++;
            }
            return question;
        })
        console.log(this)
    }

    createDOMPoll(){
        this.titleDOM.textContent = this.title;
    
        this.totalVoteDOM.textContent = `Total: ${this.calculTotalVote()}`;
    
        // CREATE BAR
        for(const {_id, label, votes} of this.questions){
            const wrapperBar = document.createElement('div');
            wrapperBar.classList.add('vote');
            wrapperBar.addEventListener('click', (evt) => this.vote(evt));
            wrapperBar.dataset.id = _id;
    
            const percent = this.nbTotalVotes !== 0 ? Math.ceil((100 * votes) / this.nbTotalVotes ) : 0;
    
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.width = `${percent}%`;
    
            const wrapperLabel = document.createElement('div');
            wrapperLabel.classList.add('label');
            wrapperLabel.textContent = label;
    
            const spanVotes = document.createElement('span');
            spanVotes.textContent = `${votes} (${percent}%)`;
    
            wrapperBar.append(bar, wrapperLabel, spanVotes);
            this.contentVoteDOM.append(wrapperBar);
        }
    }

    updateDOMPoll(){
        this.totalVoteDOM.textContent = `Total: ${this.calculTotalVote()}`;

        for (const [key, value] of Object.entries(this.questions)) {
            const votes = value.votes;
            const label = value.label;
            
            const percent = this.nbTotalVotes !== 0 ? Math.ceil((100 * votes) / this.nbTotalVotes ) : 0;
            const wrapperBar = this.contentVoteDOM.childNodes[key];
    
            const bar = wrapperBar.getElementsByClassName('bar')[0];
            bar.style.width = `${percent}%`;
    
            const wrapperLabel = wrapperBar.getElementsByClassName('label')[0];
            wrapperLabel.textContent = label;
    
            const spanVotes = wrapperBar.getElementsByTagName('span')[0];
            spanVotes.textContent = `${votes} (${percent}%)`;
        }
    }

    calculTotalVote(){
        this.nbTotalVotes = this.questions.reduce((accumulator, currentValue) => {
            return accumulator += parseInt(currentValue.votes);
        }, 0);

        return this.nbTotalVotes;
    }
}