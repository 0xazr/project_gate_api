const express = require('express');
const SETUP = require("./setup.json");
const MIDDLEWARE = require("./middleware.js");
const bodyParser = require('body-parser');
const { handle, insertData, getData, handleEntry, handleExit, insertCardId } = require('./app.js');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', MIDDLEWARE.validateParams, getData);

// app.post(['/masuk', '/keluar'], MIDDLEWARE.checkParams, handleEntryExit);
app.post('/masuk', MIDDLEWARE.checkParams, handleEntry);
app.post('/keluar', MIDDLEWARE.checkParams, handleExit);

app.post('/insert_data', MIDDLEWARE.validateParams, insertData);

app.post('/insert_card', MIDDLEWARE.checkParams, insertCardId);

app.listen(SETUP.port_api, () => {
    console.log(`Server started on port ${SETUP.port_api}`);
});