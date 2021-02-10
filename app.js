const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const mongoose = require('mongoose');
const service = require('feathers-mongoose');

var path = require('path');
require('dotenv').config();

// Models
const PollModel = require("./Models/Poll");

const events = require('./Events/events');

// Creates an ExpressJS compatible Feathers application
const app = express(feathers());

// Parse HTTP JSON bodies
app.use(express.json());
// Parse URL-encoded params
app.use(express.urlencoded({ extended: true }));
// Host static files from the current folder
app.use(express.static(__dirname));
// Add REST API support
app.configure(express.rest());
// Configure Socket.io real-time APIs
app.configure(socketio());

mongoose.connect(process.env.DB_HOST, { useUnifiedTopology: true, useNewUrlParser: true });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Views', 'Polls.html'));
});

app.use('/polls', service({
    Model: PollModel,
    lean: true, // set to false if you want Mongoose documents returned
    paginate: {
      default: 2,
      max: 4
    }
}));

// Register a nicer error handler than the default Express one
app.use(express.errorHandler());

events(app);

// Start the server
app.listen(3030).on('listening', () =>
  console.log('Feathers server listening on localhost:3030')
);