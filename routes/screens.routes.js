const screensCntrl = require('../api/controllers/screens.controller');
const passport = require('passport');

module.exports = function (app, express) {
    const rScreens = express.Router();
    rScreens
        .post('/:id/screen', passport.authenticate('jwt', { session: false }), screensCntrl.createScreens)
        .delete('/:id/screen/:screenId', passport.authenticate('jwt', { session: false }), screensCntrl.deleteScreen)
        .put('/:id/screen/:screenId', passport.authenticate('jwt', { session: false }), screensCntrl.updateScren)
        .get('/:id/screen', screensCntrl.getScreens)

    app.use(`${process.env.ROUTE}/solutions`, rScreens)
}
