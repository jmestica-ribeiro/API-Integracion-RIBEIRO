const axios = require('axios');
const qs = require('qs')

// Almacenamiento de token
let accessToken = null;
// Expiración del token
let tokenReceivedAt = null; 

//---------------------------------------------- Obtener Token de FINNEGANS --------------------------------------------------

async function loginAndGetToken() {
    try {

        const auth = Buffer.from(`${process.env.FRACTTAL_API_KEY}:${process.env.FRACTTAL_API_SECRET}`).toString('base64');

        //Login 
        const response = await axios.post(`${process.env.AUTH_FRACTTAL_API_URL}`,
            
            qs.stringify({ grant_type: 'client_credentials' }), // Cuerpo x-www-form-urlencoded
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`,
          }
        });

        return response.data.access_token

    } catch (error) {

        console.error('Error al obtener el token:', error);
        throw new Error('No se pudo autenticar');
        
    }
}


// Middleware para autenticar y renovar el token si es necesario
async function authenticateFracttal(req, res, next) {

    // Verificación de expiración
    const tokenExpirationTime = 2    * 60 * 60 * 1000;  // 2 horas en milisegundos

    // Si el token no existe o ha expirado, obtenemos un nuevo token
    if (!accessToken || Date.now() - tokenReceivedAt > tokenExpirationTime) {
        console.log('FRACTTAL - Token expirado o no disponible. Obteniendo un nuevo token...');
        try {
            accessToken = await loginAndGetToken();  // Obtener un nuevo token
            tokenReceivedAt = Date.now();  // Almacenamos el tiempo de obtención del token
        } catch (error) {
            return res.status(401).json({ message: 'Autenticación fallida', error: error.message });
        }
    }

    // Se agrega Token a body
    req.TOKEN_FRACTTAL = accessToken

    // Siguiente middleware/ruta
    next();
}

module.exports = authenticateFracttal;
