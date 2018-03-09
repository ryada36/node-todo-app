var mongoose = require('mongoose');

//to use promises with mongoose
mongoose.Promise=global.Promise;
const DB_URL=process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';
mongoose.connect(DB_URL);

module.exports={mongoose}