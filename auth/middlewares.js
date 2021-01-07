const jwt = require('jsonwebtoken');

function checkTokenSetUser(req,res,next) {
    const authHeader = req.get('Authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, (error,user) => {
               if (error) {
                    console.log(error);
               }
               req.user = user;
               next(); 
            });
        } else {
            next();
        }
    } else {
        next();
    }
};
function unAuthorized(res,next) {
    const error = new Error('Un-Authorized.');
        res.status(401);
        next(error);
};
function isLoggedIn(req,res,next) {
    if(req.user) {
        next();
    } else {
        unAuthorized(res,next);     
    }
};
function isAdmin(req,res,next) {
    if(req.user.role === 'admin') {
        next();
    } else {
        unAuthorized(res,next);
    }
}


module.exports = { checkTokenSetUser, isLoggedIn, isAdmin };
