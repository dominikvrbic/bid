const express = require('express');
const cookieSession = require('cookie-session');
const enableWs = require('express-ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');
const config = require('./config/database.json')['development'];

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

console.log('Config? ', config);
const sequelize = new Sequelize(config);
const User = sequelize.import('./db/models/user.js');
const Bid = sequelize.import('./db/models/bid.js');
const Picture = sequelize.import('./db/models/picture.js');
console.log('User?', User);

app.get('/', (req, res) => res.send('Alo bre'));

async function addImg(imgData) {
    return Picture.create({
        title: imgData.title,
        photographer: imgData.photographer,
        imageFilename: imgData.imageFilename,//url
        startingPrice: imgData.startingPrice,
    });
}

async function addUser(userData) {
    console.log(userData);
    return User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: await User.hashPassword(userData.password),
        email: userData.email.toLowerCase(),
    });
}

async function register(req, res) {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({ error: 'missing_field' });
        return;
    }

    addUser({ firstName, lastName, password, email });

    res.sendStatus(201);
}

async function tryLogin(email, password) {
    console.log(email, password);
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return null;
    }

    const passCorrect = await user.validPassword(password);
    if (passCorrect) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    } else {
        return null;
    }
}
// addUser({
//     firstName: 'Dominik',
//     lastName: 'Vrbic',
//     password: 'blabla',
//     email: 'dvrbic@gmail.com',
// });

// addImg({
//     title: 'prva',
//     photographer: 'idk',
//     imageFilename: 'https://imgur.com/EawenPh', //url, max 255 characters
//     startingPrice: 10,
// });

//tryLogin('dvrbic@gmail.com', 'blabla').then(user => console.log('User: ', user));


enableWs(app);
app.use(bodyParser.json());
async function login(req, res) {
    const { email, password } = req.body;
    console.log('Poslase: ', { email, password });
    if (!email || !password) {
        res.sendStatus(400);
        return;
    }

    const user = await tryLogin(email, password);
    if (user) {
        req.session.userId = user.id;
        req.session.email = user.email;
        req.session.firstName = user.firstName;
        req.session.lastName = user.lastName;
        console.log('Le session: ', req.session);
        res.json({ user, loggedIn: true });
    } else {
        res.status(401).json({ error: 'invalid_username_or_password' });
    }
}

async function logout(req, res) {
    req.session = null;
    res.sendStatus(200);
}

function authStatus(req, res) {
    console.log('Le session check: ', req.session);
    const userId = req.session.userId;
    if (!userId) {
        res.status(401).json({ loggedIn: false });
        return;
    }

    const { email, firstName, lastName } = req.session;
    res.json({
        loggedIn: true,
        user: { email, firstName, lastName, id: userId }
    });
};

async function bid(req, res) {

    let bidID = req.params.id;
    let currentBid = 0;
    let x = 10;
    Bid.findOne({
        attributes: ['price'],
        where: { id: bidID }
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
            where: { bidID: id }
        })
        .then(res.send)({
            message: 'bid je uspjesan'
        })
        .catch(err => res.send({
            message: `nekaj ne valja :${err}`
        }));
}

function allImages(req, res) {
    console.log(Picture);
    Picture.findAll({ attributes: ['imageFilename', 'title', 'photographer', 'id'] })
        .then(pictures => {
            res.json(pictures);
        })
        .catch(err => res.send({
            message: `nekaj ne valja :${err}`
        }));
}

async function specImgage(req, res) {
    let bidID = req.params.id;
    Picture.findOne({
        where: {
            id: bidID
        }
    })
        .then(picture => {
            res.json(picture);
        })
        .catch(err => res.send({
            message: `nekaj ne valja :${err}`
        }));
}

//routing


app.post('/register', register);

app.post('/login', login);

app.post('/logout', logout);

app.get('/authStatus', authStatus);

app.post('addimg', addImg)

app.get('/bidup/:id', bid);

app.get('/sveslike', allImages);

app.get('/slika/:id', specImgage);
//test
app.get('/a', () => {
    console.log(123);
});

app.listen(8000);