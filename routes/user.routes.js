const userCntrl = require('../api/controllers/user.controller');


module.exports = function (app, express) {
    const rUser = express.Router();
    rUser
        .post('/login', userCntrl.login)
        .post('/sigup', userCntrl.signUp)
        .post('/logout', userCntrl.logout)
    app.use(`${process.env.ROUTE}`, rUser)
}
