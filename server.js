// const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();
const { findOrCreateUser } = require("./controllers/userController");
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const PORT = process.env.PORT || 4000;
const http = require("http")

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
        onConnect: (connectionParams, webSocket, context) => {
            console.log("WebSocket Connected")
        },
        onDisconnect: () => {
            console.log("WebSocket Disconnected")
        }
    },
    context: async ({req, connection}) => {
        let authToken = null;
        let currentUser = null
        if (connection) {
            return connection.context;
        } 
        try {
            authToken = req.headers.authorization
            if(authToken) {
                currentUser = await findOrCreateUser(authToken)
            }
        } catch(err) {
            console.error("Unable", err)
        }
        return {currentUser}
    }
})

const app = express();
server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}).then(() => {
    console.log("DB Connected")
}).catch(err => console.log(err))

httpServer.listen(PORT, () => {
    console.log(server.graphqlPath)
})
