const solutionCntrl = require('../api/controllers/solutions.controller');


module.exports = function (app, express) {
    const rSolutions = express.Router();
    rSolutions
        .post('/', solutionCntrl.createSolutions)
        .get('/:company', solutionCntrl.getSolutions)
        .delete('/:id', solutionCntrl.deleteSoluction)
        .put('/:id/process/:process', solutionCntrl.updateProcessInSolution);

    app.use(`${process.env.ROUTE}/solutions`, rSolutions)
}
