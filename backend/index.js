const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' }); // Specify the correct path to your .env file

console.log('DB_URI:', process.env.DB_URI); // Debug to confirm variable loading

const DB_URI = process.env.DB_URI;

async function connectToDatabase() {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connection to MongoDB established successfully!');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
}

// Run the connection test
connectToDatabase();


