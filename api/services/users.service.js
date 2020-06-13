
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserModel = require('../models/user.model');
const servHelper = require('../helpers/services.helper');
const logger = require('../common/logger');
const HttpError = require('../helpers/httpError');
const { SIGNED_UP, INVALID_DATA, AUTHENTICATION_FAILURE, INVALID_PASSWORD, ERROR_AUTHENTICATING, ERROR_SIGNING_UP, LOGOUT_ERROR } = require('../helpers/errorCodes');
const { OK } = require('../helpers/httpResponses');

class UserService {

    /**
     * Get user by id
     * @param {ObjectId} id 
     */
    getUserById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await UserModel.findOne({ _id: id });
                resolve(user);
            } catch (error) {
                logger.error(`Error in getUserById for: ${error.message}`);
                reject(new HttpError(AUTHENTICATION_FAILURE));
            }
        });
    }

    /**
     * Login in API
     * @param {String} username Username
     * @param {String} password Password
     */
    login(req) {
        return new Promise(async (resolve, reject) => {
            try {
                const { username, password } = req.body;

                if (!servHelper.isString(username) || !servHelper.isString(password)) throw new HttpError(INVALID_DATA);

                const user = await UserModel.findOne({ username });

                if (!user) throw new HttpError(USER_NOT_FOUND);

                const encoded = crypto.createHash("sha256")
                    .update(password)
                    .digest("hex");

                if (encoded != user.password) throw new HttpError(INVALID_PASSWORD);

                console.log('token',user);
                const token = jwt.sign(
                    { id: user._id.toString() },
                    process.env.SECRET,
                    { expiresIn: 100000 }
                );

                await UserModel.updateOne({ _id: user.id }, { token });

                resolve({ ...OK, token });
            } catch (error) {
                logger.error(`Error in login for: ${error.message}`);
                if (error instanceof HttpError) {
                    reject(servHelper.manageError(error));
                } else {
                    reject(new HttpError(ERROR_AUTHENTICATING));
                }
            }
        })
    }

    /**
     * Sigup
     * @param {String} username Username
     * @param {String} password Password
     */
    signUp(req) {
        return new Promise(async (resolve, reject) => {
            try {
                const { username, password } = req.body;

                const user = await UserModel.findOne({ username });

                if (user) throw new HttpError(SIGNED_UP);

                const newUser = new UserModel();
                newUser.username = username;
                newUser.password = crypto.createHash("sha256").update(password).digest("hex");
                newUser.role = "admin";

                await newUser.save();

                resolve(await this.login(req));
            } catch (error) {
                logger.error(`Error in signUp for: ${error.message}`);
                if (error instanceof HttpError) {
                    reject(servHelper.manageError(error));
                } else {
                    reject(new HttpError(ERROR_SIGNING_UP));
                }
            }
        });
    }

    /**
     * Logout
     * @param {String} userId Id of user
     */
    logout(req) {
        return new Promise(async (resolve, reject) => {
            try {
                const { username } = req.body;
                await UserModel.updateOne({ username }, { token: null });
                resolve(OK);
            } catch (error) {
                logger.error(`Error in logout for: ${error.message}`);
                reject(new HttpError(LOGOUT_ERROR));
            }
        });
    }
}

module.exports = new UserService();