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

async function bid(req, res) {

    let picID = req.params.id;
    let korisnikId = req.params.korisnikId;
    let currentBid = 0;
    let x = 10;

    Bid.findOne({
        attributes: ['price'],
        where: { pictureId: picID }
    })
        .then(bid => {
            console.log(bid);
            if (bid === null) {
                Bid.create({
                    price: 10,
                    userId: 2342342,
                    pictureId: 2
                });
            } else {
                console.log(bid)
                console.log(currentBid = bid[0].price)
                currentBid = bid[0].price;
                res.send({ message: "bid je updejtan" })
            }
        })
        .catch(err => res.send({

            message: `nemrem najti id u bazi  : ${err}`
        }));
    /* Bid.update({
        price: currentBid + x,
        userId: korisnikId

    }, {
            where: { bidID: id }
        })
        .then(res.send)({
            message: 'bid je uspjesan'
        })
        .catch(err => res.send({
            message: `nekaj ne valja :${err}`
    })); */
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
