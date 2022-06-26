const express = require('express');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
// console.log(process.env.NODE_ENV);
const port = process.env.PORT || 5000
const colors = require('colors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const connectDB = require('./config/db');


const app = express();


//COnnec to mongoDB
connectDB();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
}))


app.listen(port,  console.log(`Listening on port ${port}`));