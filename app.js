require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIEDEX = require('./movies-data-small.json')

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
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

app.use((error, req, res, next) => {
    let response;
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' }};
    } else {
        response = { error };
    }
    res.status(500).json(response);
});

function handleGetMovies(req, res) {
    let results = MOVIEDEX;
    const { genre, country, avg_vote } = req.query;
    if (genre) {
        results = results.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
    }
    if (country) {
        results = results.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
    }
    if (avg_vote) {
        voteNumber = Number(avg_vote);
        if (isNaN(voteNumber)) {
            return res.status(400).send('avg_vote must be a number');
        }
        results = results.filter(movie => movie.avg_vote > voteNumber);
    }
    return res.status(200).send(results);
}

app.get('/movies', handleGetMovies);

module.exports = app;