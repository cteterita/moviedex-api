require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIEDEX = require('./movies-data-small.json')

const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        res.send(401);
    }
    next();
});

function handleGetMovies(req, res) {
    let results = MOVIEDEX;
    return res.send(200, results);
}

app.get('/movies', handleGetMovies);

module.exports = app;