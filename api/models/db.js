const mongoose = require('mongoose');

let db_url = process.env.MONGODB_URL || process.env.MONGOLAB_URI || 'mongodb://kcah:123@ds247357.mlab.com:47357/api';
mongoose.connect(db_url, () => {
  console.log('MongoDB connected sucessfully');
});

module.exports = mongoose;