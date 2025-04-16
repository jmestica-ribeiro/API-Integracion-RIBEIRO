const axios = require('axios');
const qs = require('qs')

// Almacenamiento de token
let accessToken = null;
// Expiración del token
let tokenReceivedAt = null; 


//---------------------------------------------- Obtener Token de FINNEGANS --------------------------------------------------

async function loginAndGetToken() {
    try {

        //Login 
        const response = await axios.get(`${process.env.FINNEGANS_API_BASE_URL}/oauth/token?grant_type=client_credentials&client_id=${process.env.FINNEGANS_API_CLIENT_ID}&client_secret=${process.env.FINNEGANS_API_CLIENT_SECRET}`);

        return response.data

    } catch (error) {

        console.error('Error al obtener el token:', error);
        throw new Error('No se pudo autenticar');
        
    }
}


// Middleware para autenticar y renovar el token si es necesario
async function authenticateFinnegans(req, res, next) {

    // Verificación de expiración
    const tokenExpirationTime = 8 * 60 * 60 * 1000;  // 8 horas en milisegundos

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
    req.TOKEN_FINNEGANS = accessToken

    // Siguiente middleware/ruta
    next();
}

module.exports = authenticateFinnegans;
