const express = require('express');
const mongoose = require('mongoose');
const http = require('http')
const cors = require('cors');

const routes = require('./routes.js');
const { setupWebSocket } = require('./websocket.js');


const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-i1pep.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// { origin: 'http://localhost:3000' }
app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);