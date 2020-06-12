const screensCntrl = require('../api/controllers/screens.controller');

module.exports = function (app, express) {
    const rScreens = express.Router();
    rScreens
        .post('/:id', screensCntrl.createScreens)

    app.use(`${process.env.ROUTE}/solutions`, rScreens)
}
