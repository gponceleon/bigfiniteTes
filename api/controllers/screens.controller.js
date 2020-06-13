const screenServices = require('../services/screens.service');

class Screens {
    async createScreens(req, res) {
        try {
            const response = await screenServices.createScreens(req);
            const code = response.screenWithError ? response.httpCode : response.statusCode;

            res.status(code).send({
                status: response.screenWithError ? response.httpCode : response.statusCode,
                success: true,
                message: response.message,
                data: response.screenWithError ? response.screenWithError : true
            });

        } catch (error) {
            res.status(error.httpCode).send({
                success: false,
                message: error.message,
            });
        }
    }

    async deleteScreen(req, res) {
        try {
            const response = await screenServices.deleteScreen(req);

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

    
    async updateScren(req, res) {
        try {
            const response = await screenServices.updateScreen(req);

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

    async getScreens(req, res) {
        try {
            const response = await screenServices.getSreen(req);

            res.status(response.statusCode).send({
                status: response.statusCode,
                success: true,
                message: response.message,
                data: response.solution
            });

        } catch (error) {
            res.status(error.httpCode).send({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new Screens();