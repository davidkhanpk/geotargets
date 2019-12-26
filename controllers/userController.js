const User = require('../models/User');
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.AUTH_CLIENT_ID)

exports.findOrCreateUser = async token => {
    const googleUser = await verifyAuthToken(token);
    const user = await checkIfUserExist(googleUser.email)
    return user ? user : createNewUser(googleUser)
}

const verifyAuthToken = async (token) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.AUTH_CLIENT_ID
        })
        return ticket.getPayload();
    } catch(err) {
        console.error("Error verifying Token")
    }
}

const checkIfUserExist = async email => await User.findOne({ email}).exec()
const createNewUser = (googleUser) => {
    const {name, email, picture } = googleUser
    const user = {name, email, picture};
    return new User(user).save()
}