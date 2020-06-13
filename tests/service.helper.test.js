const serviceHelper = require('../api/helpers/services.helper');
const HttpError = require('../api/helpers/httpError');
const { NOT_FOUND } = require('../api/helpers/errorCodes');

describe('Tests in services.helper', () => {
    describe('Test in isString', () => {
        test('Given the string "Hello" should return true', () => {
            const result = serviceHelper.isString("Hola");
            expect(result).toBe(true);
        });

        test('Given the number "1" should return false', () => {
            const result = serviceHelper.isString(1);
            expect(result).toBe(false);
        })
    });

    describe('Tests in manageErrror', () => {
        test('Given a Error instance should return "INTERNAL_SERVER_ERROR"', () => {
            const error = new Error('Something happend!');
            const errorToReturn = serviceHelper.manageError(error);
            expect(errorToReturn.message).toBe('Internal Server Error');
            expect(errorToReturn.httpCode).toBe(500);
        });

        test('Given a HttpError instance should return the http error', () => {
            const error = new HttpError(NOT_FOUND);
            const errorToReturn = serviceHelper.manageError(error);
            expect(errorToReturn.message).toBe('Resource not found');
            expect(errorToReturn.httpCode).toBe(404);
        });
    })
});
