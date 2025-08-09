const express = require ('express');
const cors = require ('cors');
const bodyParser = require('body-parser');
const session=require("express-session");
const DB = require ('./DB/DBconn.js'); 
require('dotenv').config(); 
const app = express();



//routes
const user = require("./Rutes/user");
const item = require("./Rutes/item");
const location = require("./Rutes/location");
const myClass = require("./Rutes/class")

const path = require('path');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // If you're accepting JSON too


//SESSION STUFF
app.set('trust proxy', 1) // trust first proxy
app.use(session({
   secret: 'some secret',
   resave: true,
   saveUninitialized: true,
   cookie: { secure: false }
}))




app.use(express.urlencoded({extended : true}));
app.use(cors({
   origin: 'http://localhost:3000',
   methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
   credentials: true
}))



app.get('/',(req,res)=>{
    res.send('Hoooola');
})

app.listen(process.env.PORT || port, ()=>{
console.log(`Server is running on port: ${process.env.PORT || port}`)
})

app.use('/user', user);
app.use('/item', item);
app.use('/location', location);
app.use('/class', myClass);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



