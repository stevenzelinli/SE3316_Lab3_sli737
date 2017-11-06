var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessageSchema   = new Schema({
    timestamp: String,
    content: String
});

module.exports = mongoose.model('Message', MessageSchema);
