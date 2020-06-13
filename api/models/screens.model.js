const mongoose = require('./dbMgr');
const Schema = mongoose.Schema;


const screensSchema = new Schema({
    width: {
        type: String,
        required: [true, 'Width is required']
    },
    height: {
        type: String,
        required: [true, 'Heigth is required'] 
    },
    page:{
        type: Number
    },
    title:{
        type: String
    }

});

module.exports = screensSchema