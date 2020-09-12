const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(cors());

app.use((req, res) => {
    res.send('Hello, world!')
});

module.exports = app;