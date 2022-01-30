const model = require('../models')
const {AccessToken} = model

module.exports = {
  authenticate(data) {
    return async function (req, res, next) {
      try {
        // Token Check
        const { authorization } = req.headers;
        if (
          !authorization ||
          authorization.split(' ').length < 1 ||
          authorization.split(' ')[0] !== 'Bearer'
        ) {
          return res.status(401).send({
            success: false,
            message: 'Unauthorized request',
          });
        }
        const access_token = authorization.split(' ')[1];
        const accessToken = await AccessToken.findOne({ where: { access_token } });
        if (!accessToken) {
          return res.status(401).send({
            success: false,
            message: 'Unauthorized request'
          })
         }
         if (new Date() > new Date(accessToken.expire)) {
           return res.status(401).send({
             success: false,
             message: 'Access token expired'
           });
         }

        next();
      } catch (error) {
        return res.status(500).send({
          success: false,
          message: error.message || 'Middleware auth error',
        });
      }
    };
  },
};