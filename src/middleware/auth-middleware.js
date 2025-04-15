const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {

    const token = req.body.access_token

    if(!token) {
        return res.status(401).json({message: 'Access token no proporcionado'})
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }

        req.user = decoded;
        next(); 
    });

}

module.exports = authenticateToken;
