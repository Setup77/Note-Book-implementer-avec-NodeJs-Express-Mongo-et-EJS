const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDB = async() =>  {
   try {
    const conn = await mongoose.connect(process.env.MONGOOB_URI);
    console.log(`Base de données bien connectée: ${conn.connection.host}`)
    }
   catch (error) {
       console.log(error);
    }
}

module.exports = connectDB;