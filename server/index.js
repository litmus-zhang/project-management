const express = require('express');
const path = require('path');
const cors = require("cors")
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

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
}))
app.use(express.static('public'));
app.get("*" , (req, res) =>
{ 
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
})


app.listen(port,  console.log(`Listening on port ${port}`));