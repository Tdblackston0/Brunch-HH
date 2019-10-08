const express = require('express');
const connectDB = require('./config/db');
const app = express();
//const bodyParser = require('body-parser');

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({extended: false}));

//app.get('/', (req,res)=> res.send('API Running'));

const users = require("./route/api/users");
const profile = require("./route/api/profile");
const posts = require("./route/api/posts");
const auth = require("./route/api/auth");
// Define Routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);
app.use('/api/auth', auth)

//Port Connection

//looks for environment variable on horuku or github. If not set the port will automatically be set to 5000

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server Running on port ${port}`));

// To run "NPM run server"