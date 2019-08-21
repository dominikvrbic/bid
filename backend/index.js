const express = require('express');
const enableWs = require('express-ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');
const config = require('./config/database.json')['development'];
const Bid = require('./db/models/bid');
const Picture = require('./db/models/picture');

const app = express();
app.use(cors());

console.log('Config? ', config);
const sequelize = new Sequelize(config);
const User = sequelize.import('./db/models/user.js');
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
//     imageFilename: 'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiZ5K3X55PkAhU2SxUIHYELADoQMwhCKAIwAg&url=http%3A%2F%2Fqnimate.com%2Funderstanding-html-img-tag%2F&psig=AOvVaw08nQ8GTGPfTIsy1lU6-ZbH&ust=1566471625388765&ictx=3&uact=3',//url
//     startingPrice: 10,

// })

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
    console.log(123);
    Picture.findAll({attributes: ['url', 'title', 'photographer', 'id']})
        .then(pictures => {
            res.send(JSON.stringify({ "response": pictures }));
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

app.get('/sveslike', allImages());

app.get('/slika/:id', specImgage);
//test
app.get('/a', () => {
    console.log(123);
});


app.listen(8000);