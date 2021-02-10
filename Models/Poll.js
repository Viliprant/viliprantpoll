const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const QuestionSchema = new Schema({ 
    label: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    }

});
const PollSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    questions: [QuestionSchema]
});
const Model = mongoose.model('Poll', PollSchema);

module.exports = Model;