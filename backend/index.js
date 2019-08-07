const express = require('express');
const enableWs = require('express-ws');

const Sequelize = require('sequelize');
const config = require('./config/database.json')['development'];

console.log('Config? ', config);
const sequelize = new Sequelize(config);
const User = sequelize.import('./db/models/user.js');
console.log('User?', User);

async function addUser(userData) {
    return User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: await User.hashPassword(userData.password),
        email: userData.email.toLowerCase(),
    });
}

async function tryLogin(email, password) {
    const user = await User.findOne({where: { email }});
    if (!user) {
        return null;
    }

    const passCorrect = await user.validPassword(password);
    return passCorrect ? user : null;
}

// addUser({
//     firstName: 'Dominik',
//     lastName: 'Vrbic',
//     password: 'blabla',
//     email: 'dvrbic@gmail.com',
// });

// tryLogin('dvrbic@gmail.com', 'blabla').then(user => console.log('User: ', user));

const app = express();
enableWs(app);

app.get('/', (req, res) => {
    res.send('Alo bre');
});

app.ws('/socket', (ws, req) => {
    ws.on('message', msg => {
        console.log('Got sg: ', msg);
        ws.send(msg);
    });

    ws.on('close', () => {
        console.log('WebSocket was closed')
    });
});

app.listen(8000);