exports.register = register;
exports.login = login;
exports.logout = logout;
exports.authStatus = authStatus;

const Sequelize = require('sequelize');
const config = require('../config/database.json')['development'];

const sequelize = new Sequelize(config);
const User = sequelize.import('../db/models/user.js');


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
