const express = require('express');

const app = express();
app.use(express.json());
app.use(logger);

function logger (req, res, next) {
  console.log('request fired ' + req.url + ' ' + req.method);
  next();
}

app.use('/api', require('./api'));
app.use('*', (req,res) => {
    res.sendStatus(404)
});

module.exports = app;
