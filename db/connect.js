const mongoose = require("mongoose");

const connectionString = "mongodb://localhost:27017/vioLibrary";

const connect_db = async () => {
  
    await mongoose
        .connect(connectionString)
        .then(() => console.log('Database connection established'))
        .catch((error) => console.log(error.message));
    
};

module.exports = {connect_db};