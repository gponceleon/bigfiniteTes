module.exports = {
    INVALID_DATA: {
        message: 'Bad Request',
        code: 3,
        httpCode: 400
    },

    INTERNAL_SERVER_ERROR: {
        message: 'Internal Server Error',
        code: 3,
        httpCode: 500
    },
    DUPLICATE_DATA: {
        message: 'Data is duplicate',
        code: 3,
        httpCode: 500
    },
    NOT_FOUND: {
        httpCode: 404,
        message: 'Resource not found'
    },
    AUTHENTICATION_FAILURE: {
        message: 'Cannot authenticate user :/',
        code: 3,
        httpCode: 401
    },
    AUTHORIZATION_FAILURE: {
        message: 'Unauthorized action :/',
        code: 4,
        httpCode: 403
    },
    USER_NOT_FOUND: {
        message: 'User is not signed up',
        code: 5,
        httpCode: 404
    },
    INVALID_PASSWORD: {
        message: 'Invalid password',
        code: 8,
        httpCode: 401
    },
    ERROR_AUTHENTICATING: {
        message: 'Unable to authenticate user :/',
        code: 9,
        httpCode: 500
    },
    LOGOUT_ERROR: {
        message: 'Unable to logout user :/',
        code: 10,
        httpCode: 500
    },
    SIGNED_UP: {
        message: 'User already signed up',
        code: 11,
        httpCode: 403
    },
    ERROR_SIGNING_UP: {
        message: 'Unable to signup user :/',
        code: 12,
        httpCode: 500
    }

}