const express = require('express');
const enableWs = require('express-ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');
const config = require('./config/database.json')['development'];

const app = express();
app.use(cors());

console.log('Config? ', config);
const sequelize = new Sequelize(config);
const User = sequelize.import('./db/models/user.js');
const Bid = sequelize.import('./db/models/bid.js');
const Picture = sequelize.import('./db/models/picture.js');
console.log('User?', User);

app.get('/', (req, res) => res.send('Alo bre'));

async function addImg(imgData){
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
async function tryLogin(email, password) {
    console.log(email, password);
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

// addImg({
//     title: 'prva',
//     photographer: 'idk',
//     imageFilename: 'http://qnimate.com/wp-content/uploads/2014/03/images2.jpg',//url, max 255 characters
//     startingPrice: 10,
// });

//tryLogin('dvrbic@gmail.com', 'blabla').then(user => console.log('User: ', user));


enableWs(app);
app.use(bodyParser.json());
async function logout(req, res) {
    req.session = null;
    res.sendStatus(200);
}


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
    Picture.findAll({attributes: ['imageFilename', 'title', 'photographer', 'id']})
        .then(pictures => {
            res.send(JSON.stringify(pictures));
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
            res.send(JSON.stringify({ "response": picture }));
        })
        .catch(err => res.send({
            message: `nekaj ne valja :${err}`
        }));
}

//routing


app.post('/register', addUser);

app.post('/login', tryLogin);

app.post('/logout', logout);

app.post('addimg',addImg)

app.get('/bidup/:id', bid);

app.get('/sveslike', allImages);

app.get('/slika/:id', specImgage);
//test
app.get('/a', () => {
    console.log(123);
});


app.listen(8000);