class TypeValidator {
    isString(params) {
        return typeof params === 'string' ? true : false;
    }
}

module.exports = new TypeValidator();


