const express = require('express');
const app = express();
const volleyball = require('volleyball');
const helmet = require('helmet');
const auth = require('./auth');
const cors = require('cors');
const middlewares = require('./auth/middlewares');
const notes = require('./api/notes');
const users = require('./api/users');

app.use(volleyball);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(middlewares.checkTokenSetUser);

app.get('/', (req,res) => {
    res.json({
        message: 'Hello from express!',
        user: req.user
    });
});

app.use('/auth', auth);
app.use('/api/v1/users', middlewares.isLoggedIn, middlewares.isAdmin, users);
app.use('/api/v1/notes', middlewares.isLoggedIn, notes);

function notFound(req,res,next) {
    res.status(404);
    const error = new Error('not Found', req.originUrl);
    next(error);
}

function errorHandler(err,req,res,next){
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

const port = process.env.PORT ||5000;
app.listen(port,() => {console.log('listening on port ', port)
});

app.use(notFound);
app.use(errorHandler);
