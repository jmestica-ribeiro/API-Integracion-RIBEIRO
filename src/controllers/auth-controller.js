const jwt = require('jsonwebtoken');

const login = (req, res) => {

    const {client_id, client_secret} = req.body

    //---------- Validate credentials

    const CLIENT_SECRET = process.env.CLIENT_SECRET_FINN
    const CLIENT_ID = process.env.CLIENT_ID_FINN

    if(client_id !== CLIENT_ID || client_secret !== CLIENT_SECRET){
        return res.status(401).json({message: 'Credenciales inválidas'})
    }

    //---------- Sign credentials
 
    const accessToken = jwt.sign({client_id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '12h'})
    
    res.status(200).json({message: 'Login exitoso', accessToken})
}

const verify = (req, res) => {
    
    const {access_token} = req.body

    if (!access_token) {
        return res.status(400).json({ message: 'Token no proporcionado'});
    }

    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {

        // Token inválido
        if (err) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }

       // Token válido
        res.status(200).json({
            message: 'Token válido',
        });
    });

} 

module.exports = {
    login,
    verify
}