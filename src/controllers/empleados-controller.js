const axios = require('axios'); 

// Nuevo en viewID = 50582
const nuevoEmpleado = async (req, res) => {

    const {object} = req.body
    const {TOKEN_VISMA, TOKEN_MICROSOFT, TOKEN_FINNEGANS} = req

    const {code: id_empleado} = object


    //--------------------------------------- Petición 1: Información a SharePoint - BD Generales Personal ----------------
    data_sharepoint = {

    }





    // ------------------------------------------------ FIN PETICIÓN ----------------------------------------------------

    // --------------------------------------- Petición 2: Información a TuRecibo ---------------------------------------
   
    //1- Buscar empleado en Finnegans con legajo
    let empleado_finnegans = await (await axios.get(`${process.env.FINNEGANS_API_BASE_URL}/Empleado/${id_empleado}?ACCESS_TOKEN=${TOKEN_FINNEGANS}`)).data

    let {IdentificacionTributariaNumero: cuilEmpleado} = empleado_finnegans
    cuilEmpleado = cuilEmpleado.replaceAll("-", "")

    //2- Chequear si el empleado existe en VISMA 

    const check_user = await axios.get(`${process.env.PRODUCTION_URL_VISMA}/v2/admin-mod/users/search?filter=${cuilEmpleado}`, 
        {
            headers: {
                Authorization: `Bearer ${TOKEN_VISMA}`
            }
        }
    )
    
    console.log(check_user.data)    

   
    // data_visma = {
    //     usuario: `${PersonaNombre}${PersonaApellido}`,
    //     nombre:  PersonaNombre,
    //     apellido: PersonaApellido,
    //     mail: Email,
    //     pass: generatedPassword,
    //     dni:  IdentificacionTributariaNumero.match(/-(.*?)-/)[1],
    //     cuil: IdentificacionTributariaNumero.replace(/-/g, ""),
    //     fecha_contratacion: FechaAlta,
    //     numero_legajo: Codigo,
    
    // }

    // const results = await Promise.allSettled([
    //     axios.post(`${process.env.DEMO_URL_VISMA}/v2/admin-mod/users`, data_visma, {
    //         headers: {
    //             'Authorization': `Bearer ${TOKEN_VISMA}`
    //         }
    //     }), 
    // ]);

    // console.log('------------------------------------')
    // console.log(`Petición VISMA: ${results[0].status}`)
    // console.log('------------------------------------')

    // if(results[0].status == 'rejected'){
    //     console.log(results[0].reason.response.data.codes[0].message)
    // }

    // // --------------------------------------- FIN PETICIÓN ---------------------------------------
    
    res.status(200).json({message: 'WebHook procesado'})
    
}

// Modificación de atributos en https://go.finneg.com/mas/vista?viewID=51465
const modificacionCCToCECO = async (req, res) => {

    const {CentroDeCosto, CCT} = req.body2

} 

// Modificación de atributos en viewID = 50582 

// requiere

// {
//     "ID": "",
//     "cambios": {
//         "NombreApellido": "valor1",
//         "Email": "valor2",
//          ... otros cambios
//     }
// }


const modificacionInformacionGeneral = async (req, res) => {

    const {userId} = req.body

    const fieldMap = {
        PersonaNombre: '',
        PersonaApellido: '', 
        Codigo: '',
        Email: '',
        FechaAlta: '',
        IdentificacionTributariaNumero: '' 
    }



}

module.exports = {
    nuevoEmpleado,
    modificacionCCToCECO,
    modificacionInformacionGeneral
}