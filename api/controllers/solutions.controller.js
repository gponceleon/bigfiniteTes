const solutionService = require('../services/solutions.service');

class SolutionController {
    async createSolutions(req, res) {
        try {
            const response = await solutionService.createSolutions(req);

            res.status(response.statusCode).send({
                status: response.statusCode,
                success: true,
                message: response.message,
                data: true
            });

        } catch (error) {
            res.status(error.httpCode).send({
                success: false,
                message: error.message,
            });
        }
    }

    async getSolutions(req, res) {
        try {
            const response = await solutionService.getSolutions(req);

            res.status(response.statusCode).send({
                status: response.statusCode,
                success: true,
                message: response.message,
                data: response.data
            });

        } catch (error) {
            res.status(error.httpCode).send({
                success: false,
                message: error.message,
            });
        }
    }

    async deleteSoluction(req, res) {
        try {
            const response = await solutionService.deleteSolutions(req);

            res.status(response.statusCode).send({
                status: response.statusCode,
                success: true,
                message: response.message,
                data: response.data
            });

        } catch (error) {
            res.status(error.httpCode).send({
                success: false,
                message: error.message,
            });
        }
    }

    async updateProcessInSolution(req, res) {
        try {
            const response = await solutionService.updateProcessInSolution(req);

            res.status(response.statusCode).send({
                status: response.statusCode,
                success: true,
                message: response.message,
                data: response.data
            });

        } catch (error) {
            res.status(error.httpCode).send({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new SolutionController();