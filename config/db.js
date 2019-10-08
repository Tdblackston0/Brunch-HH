const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

//Anytime using an aysnc you want to have a try/catch in order to know if its error like connecting, need to have a way for it to fail. a
const connectDB = async()=>{
  try{
    await mongoose.connect(db, {
      useNewUrlParser:true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    console.log('MongoDB Connected...');
  }catch(err){
    console.error(err.message);
    //Exit process with failure
    process.exit(1);
  }
}

module.exports = connectDB;