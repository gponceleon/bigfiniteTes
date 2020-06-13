const userServices = require('../services/users.service');

class UserController {
    async login(req, res) {
        try {
            const response = await userServices.login(req);

            res.status(response.statusCode).send({
                status: response.statusCode,
                success: true,
                message: response.message,
                data: response.token
            });

        } catch (error) {
            console.log(error)
            res.status(error.httpCode).send({
                success: false,
                message: error.message,
            });
        }
    }

    async signUp(req, res) {
        try {
            const response = await userServices.signUp(req);

            res.status(response.statusCode).send({
                status: response.statusCode,
                success: true,
                message: response.message,
                data: 'Sign up and Login!'
            });

        } catch (error) {
            res.status(error.httpCode).send({
                success: false,
                message: error.message,
            });
        }
    }

    async logout(req, res) {
        try {
            const response = await userServices.logout(req);

            res.status(response.statusCode).send({
                status: response.statusCode,
                success: true,
                message: response.message,
                data: 'Logout!'
            });

        } catch (error) {
            res.status(error.httpCode).send({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new UserController();