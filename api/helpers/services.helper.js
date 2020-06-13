const HttpError = require('../helpers/httpError');
const { INTERNAL_SERVER_ERROR } = require('../helpers/errorCodes');

class TypeValidator {
    isString(param) {
        return typeof param === 'string' ? true : false;
    }

    isNumber(param) {
        return typeof param === 'number' ? true : false;
    }

    /**
     * Manage the error for the correct response
     * @param {*} error 
     */
    manageError(error) {
        return error instanceof HttpError ? error : INTERNAL_SERVER_ERROR;
    }
}

module.exports = new TypeValidator();


