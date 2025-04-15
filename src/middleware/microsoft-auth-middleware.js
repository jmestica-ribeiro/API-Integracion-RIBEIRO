const axios = require('axios');
const qs = require('qs')

// Almacenamiento de token
let accessToken = null;
// Expiración del token
let tokenReceivedAt = null; 


//---------------------------------------------- Obtener Token de VISMA --------------------------------------------------

async function loginAndGetToken() {
    try {

        //Login 
        const response = await axios.post( 
            
            //URL
            process.env.AUTH_MICROSOFT_API_URL, 
            
            //Credentials
            qs.stringify(  {client_id: process.env.CLIENT_ID_MICROSOFT_API,
                client_secret: process.env.CLIENT_SECRET_MICROSOFT_API,
                scope: process.env.SCOPE_MICROSOFT_API,
                grant_type : 'client_credentials'}),
            
            //Headers
            {headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }}
        );

        return response.data.access_token

    } catch (error) {

        console.error('Error al obtener el token:', error);
        throw new Error('No se pudo autenticar');
        
    }
}


// Middleware para autenticar y renovar el token si es necesario
async function authenticateMicrosoftAPI (req, res, next) {

    // Verificación de expiración
    const tokenExpirationTime = 3600

    // Si el token no existe o ha expirado, obtenemos un nuevo token
    if (!accessToken || Date.now() - tokenReceivedAt > tokenExpirationTime) {
        console.log('MICROSOFT - Token expirado o no disponible. Obteniendo un nuevo token...');
        try {
            accessToken = await loginAndGetToken();  // Obtener un nuevo token
            tokenReceivedAt = Date.now();  // Almacenamos el tiempo de obtención del token
        } catch (error) {
            return res.status(401).json({ message: 'Autenticación fallida', error: error.message });
        }
    }

    // Se agrega Token a body
    req.TOKEN_MICROSOFT = accessToken

    // Siguiente middleware/ruta
    next();
}

module.exports = authenticateMicrosoftAPI;
