const Response = require('./Response')
const jwToken = require('./jwtToken')
const { User } = require('../schema/users')

module.exports = {
  adminTokenAuth: async (req, res, next) => {   
    const token = req.headers.authorization
    if (!token) {
      Response.errorResponseData(res, 'authorizationError', 401)
    } else {
      const tokenData = await jwToken.decode(token)
      if (tokenData) {
        jwToken.verify(tokenData, (err, decoded) => {
          if (err) {
            Response.errorResponseData(res, 'invalidToken', 401)
          }
          if (decoded.id) {
            req.authUserId = decoded.id
            // eslint-disable-next-line consistent-return
            User.findOne({
                _id: req.authUserId,
            }).then(async (result) => {
              if (!result) {
                return Response.errorResponseData(
                  res,
                  'invalidToken',
                  401
                )
              } else {
                if(result.role !== 'admin'){
                    return Response.errorResponseData(
                        res,
                        'invalidToken',
                        401
                      )
                }
                req.user = result
                  return next()
              }
            })
          } else {
            return Response.errorResponseData(
              res,
              'invalidToken',
              401
            )
          }
        })
      } else {
        return Response.errorResponseData(
          res,
          'invalidToken',
          401
        )
      }
    }
    return null
  },
  managerTokenAuth: async (req, res, next) => {   
    const token = req.headers.authorization
    if (!token) {
      Response.errorResponseData(res, 'authorizationError', 401)
    } else {
      const tokenData = await jwToken.decode(token)
      if (tokenData) {
        jwToken.verify(tokenData, (err, decoded) => {
          if (err) {
            Response.errorResponseData(res, 'invalidToken', 401)
          }
          if (decoded.id) {
            req.authUserId = decoded.id
            // eslint-disable-next-line consistent-return
            User.findOne({
                _id: req.authUserId,
            }).then(async (result) => {
              if (!result) {
                return Response.errorResponseData(
                  res,
                  'invalidToken',
                  401
                )
              } else {
                if(result.role !== 'manager'){
                    return Response.errorResponseData(
                        res,
                        'invalidToken',
                        401
                      )
                }
                req.user = result
                  return next()
              }
            })
          } else {
            return Response.errorResponseData(
              res,
              'invalidToken',
              401
            )
          }
        })
      } else {
        return Response.errorResponseData(
          res,
          'invalidToken',
          401
        )
      }
    }
    return null
  },
}
