const express = require('express');
const cookieSession = require('cookie-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const routerUser = require('./routes/user');
const routerImg = require('./routes/img');
const app = express();
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));
app.use(cookieSession({
    name: 'session',
    keys: ['NecesRazbojniceMasonski42'],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(bodyParser.json());
app.use(routerUser);
app.use(routerImg);
app.listen(8000);