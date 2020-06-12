const mongoose = require('./dbMgr');
const Schema = mongoose.Schema;
const screensSchema = require('./screens.model');


const schema = new Schema({
    company: {
        type: String,
        required: [true, 'Company Name is required']
    },
    process: {
        type: String,
        required: [true, 'Process is required'] 
    },
    created:{
        type: Date
    },

    screens: [screensSchema]

});

schema.index({ company: 1, process: 1 }, { unique: true })

module.exports = mongoose.model('solutions', schema);
