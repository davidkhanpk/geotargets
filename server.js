const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();
const { findOrCreateUser } = require("./controllers/userController");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
        onConnect: (connectionParams, webSocket, context) => {
            console.log("Connected")
        },
        onDisconnect: () => {
            console.log("disconnected")
        }
    },
    context: async ({req, connection}) => {
        let authToken = null;
        let currentUser = null
        if (connection) {
            // check connection for metadata
            return connection.context;
          } 
        //   console.log("Req --- ",req.body)
        try {
            authToken = req.headers.authorization
            if(authToken) {
                currentUser = await findOrCreateUser(authToken)
            }
        }catch(err) {
            console.error("Unable", err)
        }
        return {currentUser}
    }
})

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}).then(() => {
    console.log("DB Connected")
}).catch(err => console.log(err))

server.listen().then(({url}) => {
    console.log(`Server ${url}`)
})
