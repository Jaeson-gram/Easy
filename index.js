import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import articlesRouter from './routes/articles.js'
import writersRouter from './routes/writers.js'
import interactionsRouter from './routes/interactions.js'
import path from 'path';
import errorHandler from './midleware/error.js';
// import session from 'express-session';
// import passport from 'passport';
import cors from 'cors';


const app = express();
dotenv.config();
const port = process.env.PORT || 7000;
const theConnectionString = 'mongodb+srv://uk:8xB9LClkzQ2aYzWb@cluster0.txusn.mongodb.net/';

//cors
// app.use(cors({origin: 'waiting for ridwan\'s', credentials: true})) 

const allowedOrigins = ['http://localhost:3000']; // Frontend origin - you're going to have to change this to your own specific


app.use(cors({
    origin: allowedOrigins, 

    methods: ['GET', 'POST', 'PUT', 'DELETE'], // HTTP methods to allow
}));


//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//session middleware
// app.use(session({secret: 'phs', resave: false, saveUninitialized: true}));

//passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

//error handler
app.use(errorHandler);

//routes
app.use('/api/articles', articlesRouter);
app.use('/api/writers', writersRouter);
app.use('/api/interactions', interactionsRouter);


await mongoose.connect(theConnectionString).then(() =>{
    app.listen(port, ()=>{
        console.log(`server running on port ${port}`);
    });

    console.log(`connected to database`);
}).catch((error) => {
    console.log(`connection falied`, error.message);

});



