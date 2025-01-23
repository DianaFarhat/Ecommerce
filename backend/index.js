const express= require('express');
const { connectToDatabase } = require('./database');
const app= express();
const DB= require('./database').connectToDatabase;

// Run the database connection
connectToDatabase();

app.use(express.json());

//Set up port
app.listen(3000, ()=>{
    console.log('Listening on port 3000')
})