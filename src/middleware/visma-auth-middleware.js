const axios = require('axios');

// Almacenamiento de token
let accessToken = null;
// Expiración del token
let tokenReceivedAt = null; 


//---------------------------------------------- Obtener Token de VISMA --------------------------------------------------

async function loginAndGetToken() {
    try {

        //Login 
        const response = await axios.post(`${process.env.DEMO_URL_VISMA}/v2/auth-mod/login`, 

            //Credentials
            {user: process.env.DEMO_USER_VISMA,
            password: process.env.DEMO_PASS_VISMA}
        );

        return response.data.jwt

    } catch (error) {

        console.error('Error al obtener el token:', error);
        throw new Error('No se pudo autenticar');
        
    }
}


// Middleware para autenticar y renovar el token si es necesario
async function authenticateVisma(req, res, next) {

    // Verificación de expiración
    const tokenExpirationTime = 12 * 60 * 60 * 1000;  // 12 horas en milisegundos

    // Si el token no existe o ha expirado, obtenemos un nuevo token
    if (!accessToken || Date.now() - tokenReceivedAt > tokenExpirationTime) {
        console.log('VISMA - Token expirado o no disponible. Obteniendo un nuevo token...');
        try {
            accessToken = await loginAndGetToken();  // Obtener un nuevo token
            tokenReceivedAt = Date.now();  // Almacenamos el tiempo de obtención del token
        } catch (error) {
            return res.status(401).json({ message: 'Autenticación fallida', error: error.message });
        }
    }

    // Se agrega Token a body
    req.TOKEN_VISMA = accessToken

    // Siguiente middleware/ruta
    next();
}

module.exports = authenticateVisma;
