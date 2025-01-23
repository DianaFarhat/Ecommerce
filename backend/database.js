const mongoose = require('mongoose');
const dotenv= require('dotenv');
dotenv.config({ path: './backend/.env' }); 

// Debug to confirm variable loading
console.log('DB_URI:', process.env.DB_URI); 

const DB_URI = process.env.DB_URI;

//Connect to DB
exports.connectToDatabase= async() => {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connection to MongoDB established successfully!');
        
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}



