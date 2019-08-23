exports.bid = bid;
exports.addImg = addImg;
exports.allImages = allImages;
exports.specImgage = specImgage;
const Sequelize = require('sequelize');
const config = require('../config/database.json')['development'];

const sequelize = new Sequelize(config);
const User = sequelize.import('../db/models/user.js');

const Bid = sequelize.import('../db/models/bid.js');
const Picture = sequelize.import('../db/models/picture.js');


const expressWs = require('express-ws')(app);


async function bid(req, res) {
    expressWs.send
    const pictureId = req.params.id;
    const userId = req.session.userId;
    if (!userId) {
        res.sendStatus(401);
        return;
    }

    const bidIncrement = 10;

    const prevBid = await Bid.findOne({
        where: { pictureId },
        order: [
            ['createdAt', 'desc']
        ]
    });

    const currentPrice = prevBid ? prevBid.price : 0;
    const nextPrice = currentPrice + bidIncrement;
    console.log('Current: ', currentPrice);
    console.log('Next: ', nextPrice);

    await Bid.create({
        userId,
        pictureId,
        price: nextPrice,
    });

    const newBid = await Bid.findOne({
        where: { pictureId },
        order: [
            ['createdAt', 'desc']
        ]
    });
    res.json(newBid);
}

async function addImg(imgData) {
    return Picture.create({
        title: imgData.title,
        photographer: imgData.photographer,
        imageFilename: imgData.imageFilename,//url
        startingPrice: imgData.startingPrice,
    });
}
// addImg({
//      title: '18',
//      photographer: 'idk',
//      imageFilename: 'http://qnimate.com/wp-content/uploads/2014/03/images2.jpg', //url, max 255 characters
//     startingPrice: 10,
// }); 

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
    let pictureId = req.params.id;
    const bid = await Bid.findOne({
        where: { pictureId },
        order: [
            ['createdAt', 'desc']
        ]
    });

    const picture = await Picture.findOne({
        where: {
            id: pictureId
        }
    });

    res.json({ picture, bid });
}

async function myBids(req, res){
    Bid.findAll({ attributes: ['imageFilename', 'title', 'photographer', 'id'],
    where: { userId: korisnikId } })
    .then(myPictures => {
        res.json(myPictures);
    })
    .catch(err => res.send({
        message: `nekaj ne valja :${err}`
    }));


}