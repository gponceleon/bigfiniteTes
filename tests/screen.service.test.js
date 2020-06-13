const mongoose = require('mongoose');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

let screenService = require('../api/services/screens.service');
const HttpError = require('../api/helpers/httpError');
const { NOT_FOUND } = require('../api/helpers/errorCodes');

const SolutionsModel = require('../api/models/solutions.model');

const sandbox = sinon.createSandbox();

describe('Tests in screenService', () => {
    describe('Test in validateFields', () => {
        test('Some fields are invalid should return false', () => {
            const screens = {
                "width": 100,
                "height": "200px",
                "page": 2,
                "title": "Pagina 1"
            }
            const response = screenService.validateFields(screens);
            expect(response).toBe(false);
        });

        test('The fields are valid should return true', () => {
            const screens = {
                "width": "100",
                "height": "200px",
                "page": 2,
                "title": "Pagina 1"
            }
            const response = screenService.validateFields(screens);
            expect(response).toBe(true);
        })
    });

    describe('Tests in insertScreens', () => {
        beforeAll(() => {
            this.solutionsMod = {
                updateOne: sinon.stub(mongoose.Model, 'updateOne')
                    .onCall(0).throws(new Error('Unexpectned error'))
                    .onCall(1).returns(true),
                save: sandbox.stub(SolutionsModel.prototype, 'save')
                    .onCall(0).throws(true)
                    .onCall(1).returns(true)
                    .onCall(2).returns(true)
            };

            this.service = proxyquire('../api/services/screens.service', { 'SolutionsModel': this.solutionsMod });

            sandbox.stub(this.service, `validateFields`)
                .onCall(0).returns(true)
                .onCall(1).returns(true)
                .onCall(2).returns(true)
                .onCall(3).returns(true)
                .onCall(4).returns(false)
        });

        test('Should catch throw error', async () => {
            let existError = false;
            try {
                await this.service.insertScreens(1, [1], [])
            } catch (error) {
                existError = true;
                expect(error.message).toBe('Unexpectned error');
            } finally {
                expect(existError).toBe(true);
            }
        });

        test('Given all correct screens should return no value in the error array', async () => {
            const errorArray = [];
            await this.service.insertScreens(1, [1, 2], errorArray);
            expect(errorArray.length).toBe(0)
        });

        test('Given one incorrect screen should return one value in the error array', async () => {
            const errorArray = [];
            await this.service.insertScreens(1, [1, 2], errorArray);
            expect(errorArray.length).toBe(1)
        });

        afterAll(() => {
            sandbox.restore();
        });
    })


    describe('Tests in createScreens', () => {
        beforeAll(() => {
            this.solutionsMod = {
                findOne: sandbox.stub(mongoose.Model, 'findOne')
                    .onCall(0).throws(new Error('Unexpected error'))
                    .onCall(1).returns(null)
                    .onCall(2).returns({
                        "_id": "5ee3cd65aa2172326bf1fe8f",
                        "company": "1",
                        "process": "i"
                    })
                    .onCall(3).returns({
                        "_id": "5ee3cd65aa2172326bf1fe8f",
                        "company": "1",
                        "process": "i"
                    }),
                save: sandbox.stub(SolutionsModel.prototype, 'save')
                    .onCall(0).throws(true)
                    .onCall(1).returns(true)
                    .onCall(2).returns(true)
            };

            this.req = {
                user: {
                    _doc: {
                        role: 'admin'
                    }
                },
                params: {
                    id: "5ee3cd65aa2172326bf1fe8f",
                },
                body: {
                    screens: [{
                        "width": "100px",
                        "height": "200px",
                        "page": 2,
                        "title": "Pagina 1"
                    }]
                }
            }
            this.screenWithError = [1]

            this.service = proxyquire('../api/services/screens.service', { 'SolutionsModel': this.solutionsMod });
            sandbox.stub(this.service, `insertScreens`)
                .onCall(0).returns(true)
                .onCall(1).returns(true)
                .onCall(2).returns(this.screenWithError)
        });

        afterAll(() => {
            sandbox.restore();
        });

        it('Should catch the error and return internal error', async () => {
            let existError = false;
            try {
                await this.service.createScreens(this.req)
            } catch (error) {
                existError = true;
                expect(error.message).toBe('Internal Server Error');
            } finally {
                expect(existError).toBe(true);
            }
        });

        it('Given the solutions was not found should throw NOT_FOUND', async () => {
            let existError = false;
            try {
                await this.service.createScreens(this.req)
            } catch (error) {
                existError = true;
                expect(error).toBeInstanceOf(HttpError);
                expect(error.message).toBe('Resource not found');
            } finally {
                expect(existError).toBe(true);
            }
        });

        it('Every screens inserted successfully', async () => {
            const rs = await this.service.createScreens(this.req);
            expect(rs.statusCode).toBe(201)
            expect(rs.httpCode).toBeUndefined();
        });
    });

    describe('Tests in deleteScreen', () => {
        beforeAll(() => {
            this.solutionsMod = {
                findOne: sandbox.stub(mongoose.Model, 'findOne')
                    .onCall(0).throws(new Error('Unexpected error'))
                    .onCall(1).returns({
                        "_id": "5ee3cd65aa2172326bf1fe8f",
                        "company": "1",
                        "process": "i",
                        "screens": []
                    }),
                id: sandbox.stub(SolutionsModel.prototype, 'id')
                    .onCall(0).returns({
                        remove: sandbox.stub().returns(true)
                    })
            };

            this.req = {
                user: {
                    _doc: {
                        role: 'admin'
                    }
                },
                params: {
                    id: "5ee3cd65aa2172326bf1fe8f",
                    screenId: "6ee3cd65aa2172326bf1fe8f"
                }
            }

            this.service = proxyquire('../api/services/screens.service', { 'SolutionsModel': this.solutionsMod });
        });

        it('Should catch the error and return internal error', async () => {
            let existError = false;
            try {
                await this.service.deleteScreen(this.req)
            } catch (error) {
                existError = true;
                expect(error.message).toBe('Internal Server Error');
            } finally {
                expect(existError).toBe(true);
            }
        });

        it('Should catch error when id is undefined', async () => {
            let existError = false;
            try {
                await this.service.deleteScreen(this.req)
            } catch (error) {
                existError = true;
                expect(error.message).toBe('Internal Server Error');
            } finally {
                expect(existError).toBe(true);
            };
        })

        afterAll(() => {
            sandbox.restore();
        });
    });

    describe('Tests in deleteScreen', () => {
        beforeAll(() => {
            this.solutionsMod = {
                findOne: sandbox.stub(mongoose.Model, 'findOne')
                    .onCall(0).throws(new Error('Unexpected error'))
                    .onCall(1).returns({
                        "_id": "5ee3cd65aa2172326bf1fe8f",
                        "company": "1",
                        "process": "i",
                        "screens": []
                    }),
                id: sandbox.stub(SolutionsModel.prototype, 'id')
                    .onCall(0).returns({
                        remove: sandbox.stub().returns(true)
                    })
            };

            this.req = {
                user: {
                    _doc: {
                        role: 'admin'
                    }
                },
                params: {
                    id: "5ee3cd65aa2172326bf1fe8f",
                    screenId: "6ee3cd65aa2172326bf1fe8f"
                }
            }

            this.service = proxyquire('../api/services/screens.service', { 'SolutionsModel': this.solutionsMod });
        });

        it('Should catch the error and return internal error', async () => {
            let existError = false;
            try {
                await this.service.updateScreen(this.req)
            } catch (error) {
                existError = true;
                expect(error.message).toBe('Internal Server Error');
            } finally {
                expect(existError).toBe(true);
            }
        });

        it('Should catch error when id is undefined', async () => {
            let existError = false;
            try {
                await this.service.updateScreen(this.req)
            } catch (error) {
                existError = true;
                expect(error.message).toBe('Internal Server Error');
            } finally {
                expect(existError).toBe(true);
            };
        })

        afterAll(() => {
            sandbox.restore();
        });
    });

    describe('Test in getSreen', () => {
        beforeAll(() => {
            this.solutionsMod = {
                findOne: sandbox.stub(mongoose.Model, 'findOne')
                    .onCall(0).throws(new Error('Unexpected error'))
                    .onCall(1).returns(null)
                    .onCall(2).returns({
                        "_id": "5ee3cd65aa2172326bf1fe8f",
                        "company": "1",
                        "process": "i",
                        "screens": []
                    }),
            };

            this.req = {
                user: {
                    _doc: {
                        role: 'admin'
                    }
                },
                params: {
                    id: "5ee3cd65aa2172326bf1fe8f",
                }
            }

            this.service = proxyquire('../api/services/screens.service', { 'SolutionsModel': this.solutionsMod });
        });

        it('Should catch the error and return internal error', async () => {
            let existError = false;
            try {
                await this.service.getSreen(this.req)
            } catch (error) {
                existError = true;
                expect(error.message).toBe('Internal Server Error');
            } finally {
                expect(existError).toBe(true);
            }
        });

        it('Given no data should return NO_CONTENT', async () => {
            const rs = await this.service.getSreen(this.req)
            expect(rs.statusCode).toBe(204)
        });

        it('Given data should return OK', async () => {
            const rs = await this.service.getSreen(this.req)
            expect(rs.statusCode).toBe(200)
            expect(rs.solution).toMatchObject
                ({
                    "_id": "5ee3cd65aa2172326bf1fe8f",
                    "company": "1",
                    "process": "i",
                    "screens": []
                })
        });


        afterAll(() => {
            sandbox.restore();
        });
    });

});