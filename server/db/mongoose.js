var mongoose = require('mongoose');

//mongodb://ryada36:montiY#89@ds163418.mlab.com:63418/todo
//to use promises with mongoose

const REMOTE_MONGO='mongodb://ryada36:montiY#89@ds163418.mlab.com:63418/todo';

mongoose.Promise=global.Promise;
const DB_URL=process.env.PORT ? REMOTE_MONGO : 'mongodb://localhost:27017/TodoApp';
mongoose.connect(DB_URL);

module.exports={mongoose}