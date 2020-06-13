const screensCntrl = require('../api/controllers/screens.controller');

module.exports = function (app, express) {
    const rScreens = express.Router();
    rScreens
        .post('/:id/screen', screensCntrl.createScreens)
        .delete('/:id/screen/:screenId', screensCntrl.deleteScreen)
        .put('/:id/screen/:screenId', screensCntrl.updateScren)
        .get('/:id/screen',screensCntrl.getScreens)

    app.use(`${process.env.ROUTE}/solutions`, rScreens)
}
