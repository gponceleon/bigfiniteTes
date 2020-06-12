const bodyParser = require('body-parser')

/**
 * Export api's modules from express framework
 */
module.exports = function (app) {
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
}
