const logger = require('../common/logger');
const SolutionModel = require('../models/solutions.model');
const servHelper = require('../helpers/services.helper');
const HttpError = require('../helpers/httpError');
const { CREATED, NO_CONTENT, OK } = require('../helpers/httpResponses');
const { INVALID_DATA, INTERNAL_SERVER_ERROR, DUPLICATE_DATA, NOT_FOUND } = require('../helpers/errorCodes');

class Screens {

    /**
     * Validate fields type
     * @param {Object} screen 
     */
    validateFields(screen) {
        return !servHelper.isString(screen.width) || !servHelper.isString(screen.height) ||
            !servHelper.isString(screen.title) || !servHelper.isNumber(screen.page) ? false : true;
    }

    /**
     * Insert and valid every screen
     * @param {String} id Id of solutions
     * @param {Array} screens Array of screens
     * @param {Array} screensWithError Array with incorrect screen
     */
    insertScreens(id, screens, screensWithError) {
        return new Promise(async (resolve, reject) => {
            try {
                for (const screen of screens) {
                    const isValid = this.validateFields(screen);

                    if (isValid) {
                        await SolutionModel.updateOne({ _id: id }, { $push: { screens: screen } });
                    } else {
                        screensWithError.push(screen);
                    }
                }
                resolve(true);
            } catch (error) {
                logger.error(`Error in insertScreens for: ${error.message}`);
                reject(error);
            }
        });
    }

    /**
     * Create a list of screens in solutiosn
     * @param {*} req Request
     */
    createScreens(req) {
        return new Promise(async (resolve, reject) => {
            try {
                const { id } = req.params;
                const { screens } = req.body;
                const screenWithError = [];

                const solutions = await SolutionModel.findOne({ _id: id });

                if (!solutions) throw new HttpError(NOT_FOUND);

                await this.insertScreens(id, screens, screenWithError);

                const response = screenWithError.length ? { ...INVALID_DATA, screenWithError } : CREATED;

                resolve(response);
            } catch (error) {
                logger.error(`Error in createSolutions for: ${error.message}`);
                reject(servHelper.manageError(error));
            }
        });
    }
}

module.exports = new Screens();