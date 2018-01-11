const db = require('./db');

let userFiles = db.Schema({
  user_id: { type: String, required: true},
  filename: { type: String, required: true}
});

module.exports = db.model('UserFiles', userFiles);