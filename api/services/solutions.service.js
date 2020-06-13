const SolutionModel = require('../models/solutions.model');
const logger = require('../common/logger');
const servHelper = require('../helpers/services.helper');
const HttpError = require('../helpers/httpError');
const { INVALID_DATA, INTERNAL_SERVER_ERROR, DUPLICATE_DATA, NOT_FOUND, AUTHORIZATION_FAILURE } = require('../helpers/errorCodes');
const { CREATED, NO_CONTENT, OK } = require('../helpers/httpResponses');

class Solutions {

    constructor() {

    }

    /**
     * Manage the error for the correct response
     * @param {*} error 
     */
    manageError(error) {
        if (error instanceof HttpError) {
            return error
        } else {
            const label = error.message.includes('E11000 duplicate key') ? DUPLICATE_DATA : INTERNAL_SERVER_ERROR;
            return new HttpError(label);
        }
    }

    /**
     * Create the new Solucion for the company
     * @param {Object} req Request
     */
    createSolutions(req) {
        return new Promise(async (resolve, reject) => {
            try {
                const { user, body: { company, process } } = req;
                if (user._doc.role !== 'user' && user._doc.role !== 'admin') throw new HttpError(AUTHORIZATION_FAILURE);

                if (!servHelper.isString(company) || !servHelper.isString(process)) {
                    throw new HttpError(INVALID_DATA);
                }
                const model = new SolutionModel();

                model.company = company;
                model.process = process;

                await model.save();

                resolve(CREATED)
            } catch (error) {
                logger.error(`Error in createSolutions for: ${error.message}`);
                reject(this.manageError(error));
            }
        });
    };

    /**
     * Get solutions asociate to a company
     * @param {*} req 
     */
    getSolutions(req) {
        return new Promise(async (resolve, reject) => {
            try {
                const { company } = req.params;
                const data = await SolutionModel.find({ company });

                const label = !data.length ? NO_CONTENT : OK;

                resolve({
                    statusCode: label.statusCode,
                    message: label.message,
                    data
                });
            } catch (error) {
                logger.error(`Error in getSolutions for: ${error.message}`);
                reject(this.manageError(error));
            }
        })
    }

    /**
     * Delete a solution given de Id
     * @param {*} req 
     */
    deleteSolutions(req) {
        return new Promise(async (resolve, reject) => {
            try {
                const { user, params: { id } } = req;

                if (user._doc.role !== 'user' && user._doc.role !== 'admin') throw new HttpError(AUTHORIZATION_FAILURE);

                const query = await SolutionModel.deleteOne({ _id: id });

                if (query.deletedCount == 0) throw new HttpError(NOT_FOUND);

                resolve(OK)
            } catch (error) {
                logger.error(`Error in deleteSolutions for: ${error.message}`);
                reject(this.manageError(error));
            }
        });
    }

    /**
     * Update process given solution id
     * @param {*} req 
     */
    updateProcessInSolution(req) {
        return new Promise(async (resolve, reject) => {
            try {
                const { user, params: { id }, body: { process } } = req;

                if (user._doc.role !== 'user' && user._doc.role !== 'admin') throw new HttpError(AUTHORIZATION_FAILURE);

                if (!process) throw new HttpError(INVALID_DATA);

                await SolutionModel.updateOne({ _id: id }, { process });

                resolve(OK);
            } catch (error) {
                logger.error(`Error in deleteSolutions for: ${error.message}`);
                reject(this.manageError(error));
            }
        });
    }
}

module.exports = new Solutions();