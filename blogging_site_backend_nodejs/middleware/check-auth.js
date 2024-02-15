const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function checkAuth(request, response, next) {
    try {
        const token = request.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        request.userData = decodedToken;
        next();
    } catch (error) {
        return response.status(401).json({
            message: "Invalid or expired tokens provided!",
            error: error
        })
    }
}

module.exports = {
    checkAuth: checkAuth
}