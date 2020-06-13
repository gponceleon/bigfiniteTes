const solutionCntrl = require('../api/controllers/solutions.controller');
const passport = require('passport');

module.exports = function (app, express) {
    const rSolutions = express.Router();
    rSolutions
        .post('/', passport.authenticate('jwt', { session: false }), solutionCntrl.createSolutions)
        .get('/:company', solutionCntrl.getSolutions)
        .delete('/:id', passport.authenticate('jwt', { session: false }), solutionCntrl.deleteSoluction)
        .put('/:id', passport.authenticate('jwt', { session: false }), solutionCntrl.updateProcessInSolution);

    app.use(`${process.env.ROUTE}/solutions`, rSolutions)
}
