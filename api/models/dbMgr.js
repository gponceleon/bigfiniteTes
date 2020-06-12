const mongoose = require('mongoose')
const URI = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open to ' + URI)
})

mongoose.connection.on('error', (err) => {
    console.log('Mongoose default connection error: ' + err)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected')
})

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = mongoose
