var mongoose = require('mongoose');

//to use promises with mongoose
mongoose.Promise=global.Promise;


const REMOTE_MONGO='mongodb://ryada36:montiY#89@ds163418.mlab.com:63418/todo';
if(process.env.PORT){
    DB_URL=REMOTE_MONGO;
}
else{
    DB_URL=process.env.MONGODB_URI;
}
mongoose.connect(DB_URL);

module.exports={mongoose}