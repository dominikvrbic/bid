const express = require('express');
const enableWs = require('express-ws');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const config = require('./config/database.json')['development'];
const Bid = require('./db/models/bid');
const Picture = require('./db/models/picture');


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
    const user = await User.findOne({ where: { email } });
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
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Alo bre');
});
app.post('/register', (req, res) => {
    res.send({
        message: `${req.body.email}user was reged`
    })

});


app.get('/bidup/:id', (req, res) => {
    let bidID = req.params.id;
    let currentBid = 0;
    let x = 10;
    Bid.findOne({
        attributes: ['price'],
        where: {id: bidID}
    })
    .then(bid => {
        currentBid = bid[0].price;
    })
    .catch(err => res.send({
        message: `nemrem najti id u bazi  : ${err}`
    }));
    Bid.update({
        price: currentBid + x,
        
    }, {
        where: {bidID: id}
    })
    .then(res.send)({
        message: 'bid je uspjesan'
    }) 
    .catch(err => res.send({
        message: `nekaj ne valja :${err}`
    }));
});

//sve slike url, title i photographer
app.get('/sveslike', (req, res) => {
    Picture.findAll({
        attributes: ['url', 'title', 'photographer', 'id']
    })
    .then(pictures => {
        res.send(JSON.stringify({"response": pictures}));
    })
    .catch(err => res.send({
        message: `nekaj ne valja :${err}`
    }));
});

//specificna slika
app.get('/slika/:id', (req, res) => {
    let bidID = req.params.id;
    Picture.findOne({
       where: {
           id: bidID
       } 
    })
    .then(picture => {
        res.send(JSON.stringify({"response": picture}));
    })
    .catch(err => res.send({
        message: `nekaj ne valja :${err}`
    }));
});

function wsSend(socket, type, data) {
    const msg = { type, data };
    socket.send(JSON.stringify(msg));
}

app.ws('/socket', (ws, req) => {
    setInterval(() => {
        wsSend(ws, 'priceChange', { price: 100, imageId: 123 });
    }, 2000);

    ws.on('message', msg => {
        console.log('Got sg: ', msg);
        ws.send(msg);
    });

    ws.on('close', () => {
        console.log('WebSocket was closed')
    });
});

app.listen(8000);