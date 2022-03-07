require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
//Router
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

const app = express();
//Connect database
const connectDB = async() => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.uhxte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
            
        });         
        console.log("Connect Successfully");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    } 
}
connectDB();

//Route
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});