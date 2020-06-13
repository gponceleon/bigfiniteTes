const mongoose = require('./dbMgr');
const Schema = mongoose.Schema;


const usersSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    role: {
        type: String,
        required: [true, 'role is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    token: {
        type: String,
    }
});

module.exports = mongoose.model('users', usersSchema);