const mongoose = require('mongoose')
const keys = require('./keys')

module.exports = async() => {
        try{
            await mongoose.connect(keys.DB_URL, { 
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify:false
             } );
             console.log('Database Connected...');
        } catch(error) {
            console.log(error);
            process.exit(1);
        }
    } 