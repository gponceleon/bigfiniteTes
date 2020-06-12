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
    NOT_FOUND:{
        httpCode : 404,
        message: 'Resource not found'
    },


}