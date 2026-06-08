const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    try{
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization header missing or malformed"
            });
        }
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) { 
            console.error("JWT verification failed:", err);
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }    
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = authMiddleware;
