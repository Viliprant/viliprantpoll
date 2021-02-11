export default class Poll{
    constructor({_id, title, questions}, app){
        this._id = _id;
        this.title = title;
        this.questions = questions;

        this.app = app;

        // DOM Elements
        this.contentVoteDOM = document.getElementById('content-vote');
        this.totalVoteDOM = document.getElementById('total-vote');
        this.titleDOM = document.getElementById('title');
    }

    async vote(evt){
        evt.preventDefault();
        const id = evt.currentTarget.dataset.id;
        const checkbox = evt.currentTarget.getElementsByTagName('input')[0];
        checkbox.checked = !checkbox.checked;

        this.questions = this.questions.map((question) => {
            if(question._id === id) {
                checkbox.checked ? question.votes ++ : question.votes --;
            }
            return question;
        })
        await this.app.service('polls').update(this._id, {
            questions: this.questions,
            title: this.title,
        });
    }

    createDOMPoll(){
        this.titleDOM.textContent = this.title;
    
        this.totalVoteDOM.textContent = `Total: ${this.calculTotalVote()}`;
    
        // CREATE BAR
        for(const {_id, label, votes} of this.questions){
            const wrapperBar = document.createElement('label');
            wrapperBar.classList.add('vote');
            wrapperBar.for = _id;
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
    
            // Chekbox (unique vote)
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = _id;
            checkbox.hidden = true;

            wrapperBar.append(bar, wrapperLabel, spanVotes, checkbox);
            this.contentVoteDOM.append(wrapperBar);
        }
    }

    updateDOMPoll(data){
        this.title = data.title;
        this.questions = data.questions

        this.totalVoteDOM.textContent = `Total: ${this.calculTotalVote()}`;
        console.log('updated')
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