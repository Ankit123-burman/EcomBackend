const jsonwebtoken = require("jsonwebtoken")
const User = require("../models/User")

// middleware to protect route
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && typeof req.headers.authorization === 'string') {
        if (req.headers.authorization.startsWith('Bearer ')) {
            try {
                token = req.headers.authorization.split(" ")[1];
                const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

                req.user = await User.findById(decoded.user.id).select("-password");
                next();
            } catch (error) {
                console.error('token verification failed', error);
                res.status(401).json({ message: "not authorized, token failed" });
            }
        } else {
            res.status(401).json({ message: "not authorized, no token provided" });
        }
    } else {
        res.status(401).json({ message: "not authorized, no token provided" });
    }
}

module.exports = { protect };
