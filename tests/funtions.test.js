const mongoose = require('mongoose');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const serviceHelper = require('../api/helpers/services.helper');
const solutionsService = require('../api/services/solutions.service');
const HttpError = require('../api/helpers/httpError');
const { NOT_FOUND } = require('../api/helpers/errorCodes');

let SolutionsModel = require('../api/models/solutionsmodel');

const sandbox = sinon.createSandbox();

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
    })
});

describe('Test in solutionsService ', () => {
    describe('Tests in manageError', () => {
        test('Given a Error instance and not for duplicity should return "INTERNAL_SERVER_ERROR"', () => {
            const error = new Error('Something happend!');
            const errorToReturn = solutionsService.manageError(error);
            expect(errorToReturn.message).toBe('Internal Server Error');
            expect(errorToReturn.httpCode).toBe(500);
            expect(errorToReturn).toBeInstanceOf(HttpError)
        });

        test('Given a Error instance for duplicity should return "INTERNAL_SERVER_ERROR"', () => {
            const error = new Error('E11000 duplicate key fgthyju');
            const errorToReturn = solutionsService.manageError(error);
            expect(errorToReturn.message).toBe('Data is duplicate');
            expect(errorToReturn.httpCode).toBe(500);
            expect(errorToReturn).toBeInstanceOf(HttpError)
        });

        test('Given a HttpError instance should return the http error', () => {
            const error = new HttpError(NOT_FOUND);
            const errorToReturn = solutionsService.manageError(error);
            expect(errorToReturn.message).toBe('Resource not found');
            expect(errorToReturn.httpCode).toBe(404);
            expect(errorToReturn).toBeInstanceOf(HttpError)
        });
    });

    describe('Tests in createSolutions', () => {
        beforeAll(() => {
            this.solutionsMod = {
                save: sandbox.stub(SolutionsModel.prototype, 'save')
                    .onCall(0).throws(new Error('E11000 duplicate key fgthyju'))
                    .onCall(1).returns(true)
                    .onCall(2).returns(true)
            };

            this.service = proxyquire('../api/services/solutions.service', { 'SolutionsModel': this.solutionsMod });
        });

        test('The Data was duplicate', async () => {
            const req = {
                body: {
                    company: "1",
                    process: 'Process 1'
                }
            }
            let existError = false;
            try {
                await this.service.createSolutions(req);
            } catch (error) {
                existError = true;
                expect(error).toBeInstanceOf(HttpError);
                expect(error.message).toBe('Data is duplicate');
            } finally {
                expect(existError).toBe(true);
            }
        });

        test('The solutions was created successfully', async () => {
            const req = {
                body: {
                    company: 'Company Name',
                    process: 'Process 1'
                }
            }
            const response = await this.service.createSolutions(req);
            expect(response.statusCode).toBe(201);
            expect(response.message).toBe('Resource Successfully Created');
        });

        test('Given a bad request should thows error', async () => {
            const req = {
                body: {
                    company: 1,
                    process: 'Process 1'
                }
            }
            let existError = false;
            try {
                await this.service.createSolutions(req);
            } catch (error) {
                existError = true;
                expect(error).toBeInstanceOf(HttpError);
                expect(error.message).toBe('Bad Request');
            } finally {
                expect(existError).toBe(true);
            }
        });

        afterAll(() => {
            sandbox.restore();
        })
    });
});

describe('Tests in getSolutions', () => {
    beforeAll(() => {
        this.solutionsMod = {
            find: sinon.stub(mongoose.Model, 'find')
                .onCall(0).throws(new Error('Unexpected error'))
                .onCall(1).returns([])
                .onCall(2).returns([1])
        };

        this.service = proxyquire('../api/services/solutions.service', { 'SolutionsModel': this.solutionsMod });
    });

    test('Given a error should cath error', async () => {
        const req = {
            params: {
                company: "Company 1",
            }
        }
        let existError = false;
        try {
            await this.service.getSolutions(req)
        } catch (error) {
            existError = true;
            expect(error).toBeInstanceOf(HttpError);
            expect(error.message).toBe('Internal Server Error');
        } finally {
            expect(existError).toBe(true);
        }
    });

    test('Given not data found should return "Not content"', async () => {
        const req = {
            params: {
                company: "Company 1",
            }
        }
        const response = await this.service.getSolutions(req)
        expect(response.statusCode).toBe(204);
        expect(response.message).toBe('No Content');
    });

    test('Given  data found should return "OK"', async () => {
        const req = {
            params: {
                company: "Company 1",
            }
        }
        const response = await this.service.getSolutions(req)
        expect(response.statusCode).toBe(200);
        expect(response.message).toBe('Succesful Transaction');
    });

    afterAll(() => {
        sandbox.restore();
    })
});

describe('Tests in deleteSolutions', () => {
    beforeAll(() => {
        this.solutionsMod = {
            deleteOne: sinon.stub(mongoose.Model, 'deleteOne')
                .onCall(0).throws(new Error('Unexpected error'))
                .onCall(1).returns({ deletedCount: 0 })
                .onCall(2).returns({ deletedCount: 1 })
        };

        this.service = proxyquire('../api/services/solutions.service', { 'SolutionsModel': this.solutionsMod });
    });

    test('Given a error should cath error', async () => {
        const req = {
            params: {
                id: "1",
            }
        }
        let existError = false;
        try {
            await this.service.deleteSolutions(req)
        } catch (error) {
            existError = true;
            expect(error).toBeInstanceOf(HttpError);
            expect(error.message).toBe('Internal Server Error');
        } finally {
            expect(existError).toBe(true);
        }
    });

    test('Given not find the id should return "NOT_FOUND"', async () => {
        const req = {
            params: {
                id: "1",
            }
        }
        let existError = false;
        try {
            await this.service.deleteSolutions(req)
        } catch (error) {
            existError = true;
            expect(error).toBeInstanceOf(HttpError);
            expect(error.message).toBe('Resource not found');
        } finally {
            expect(existError).toBe(true);
        }
    });

    test('Given find the id should return "OK"', async () => {
        const req = {
            params: {
                id: "1",
            }
        }
        const response = await this.service.deleteSolutions(req)
        expect(response.statusCode).toBe(200);
        expect(response.message).toBe('Succesful Transaction');
    });


    afterAll(() => {
        sandbox.restore();
    })
});

describe('Tests en updateProcessInSolution', () => {
    beforeAll(() => {
        this.solutionsMod = {
            updateOne: sinon.stub(mongoose.Model, 'updateOne')
                .onCall(0).throws(new Error('Unexpected error'))
                .onCall(1).returns(true)
        };

        this.service = proxyquire('../api/services/solutions.service', { 'SolutionsModel': this.solutionsMod });
    });


    test('Given a error should cath error', async () => {
        const req = {
            params: {
                id: "1",
                process: 'P1'
            }
        }
        let existError = false;
        try {
            await this.service.updateProcessInSolution(req)
        } catch (error) {
            existError = true;
            expect(error).toBeInstanceOf(HttpError);
            expect(error.message).toBe('Internal Server Error');
        } finally {
            expect(existError).toBe(true);
        }
    });

    test('Given a value to update diferent to process should throw a error', async() => {
        const req = {
            params: {
                id: "1",
                label: 'P1'
            }
        }
        let existError = false;
        try {
            await this.service.updateProcessInSolution(req)
        } catch (error) {
            existError = true;
            expect(error).toBeInstanceOf(HttpError);
            expect(error.message).toBe('Bad Request');
        } finally {
            expect(existError).toBe(true);
        }
    });

    test('Update successfully', async () => {
        const req = {
            params: {
                id: "1",
                process: 'P1'
            }
        }
        const response = await this.service.updateProcessInSolution(req)
        expect(response.statusCode).toBe(200);
        expect(response.message).toBe('Succesful Transaction');
    });


    afterAll(() => {
        sandbox.restore();
    })
});
