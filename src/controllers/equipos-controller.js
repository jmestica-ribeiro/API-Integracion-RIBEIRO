const axios = require('axios'); 

const nuevoEquipo = async (req, res) => {

    const {object} = req.body
    const {TOKEN_FRACTTAL, TOKEN_FINNEGANS} = req

    //Se obtiene Interno recibido en el webhook
    const {code: id_equipo} = object

    //Obtener equipo en el finnegans
    let equipo_finnegans = await (await axios.get(`${process.env.FINNEGANS_API_BASE_URL}/Maquina/${id_equipo}?ACCESS_TOKEN=${TOKEN_FINNEGANS}`)).data
    

    //Chequear si existe el equipo o no en fracttal
    let equipo_fracttal = await axios.get(`${process.env.FRACTTAL_API_URL}items/${id_equipo}`, {
        headers: {
                        'Authorization': `Bearer ${TOKEN_FRACTTAL}`
                    }}
    )

    //Existe equipo en Fracttal si: la petición retorna con success y el total es 1 (se encontró el equipo)
    const existe_equipo = equipo_fracttal.data.success && equipo_fracttal.data.total === 1

    let equipo = {
        code: equipo_finnegans.Codigo,
        field_1: equipo_finnegans.Nombre,
        id_type_item: 2,
        active: equipo_finnegans.Activo, // Transfiere el activo/inactivo del finnegans
        group: equipo_finnegans.MarcaID,
        group_1: equipo_finnegans.ModeloID,
        group_2: equipo_finnegans.Marca,
        field_3: equipo_finnegans.Descripcion,

        //Nro de chasis y moto
        field_2: equipo_finnegans.NroChasis,
        
        //Número de serial
        field_4: equipo_finnegans.NroSerie,

        //Dominio
        field_6: equipo_finnegans.Patente

    }


    //Si existe el equipo, es necesario el update
    if(existe_equipo){

         //obtener el id interno de fracttal con el interno de finengans
        const id_interno_fracttal = equipo_fracttal.data.data[0].id
        
        console.log(id_interno_fracttal)

        const response = await axios.put(`${process.env.FRACTTAL_API_URL}items?id_fracttal=${id_interno_fracttal}`, equipo, {
            headers: {
                'Authorization': `Bearer ${TOKEN_FRACTTAL}`,
                'Content-Type': 'application/json'
            }
        })
        
        const nuevo_equipo = response.data

                  // Verificación de éxito
                  if (nuevo_equipo.success === true && nuevo_equipo.total === 1) {
                    console.log("✅ Webhook de máquina procesado");
                    res.status(200).json({ message: "✅ Webhook de máquina procesado", data: equipo });
        
                  } else {
                    console.warn("⚠️ Advertencia: no se pudo procesar el webhook de máquina", nuevo_equipo);
                    res.status(400).json({ message: "⚠️ Advertencia: la respuesta no fue la esperada", data: equipo });
                  }

    } 

    // Si no existe equipo se crea en fracttal
    else{  
        const response = await axios.post(
            `${process.env.FRACTTAL_API_URL}items`,
            equipo,
            {
              headers: {
                'Authorization': `Bearer ${TOKEN_FRACTTAL}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          const nuevo_equipo = response.data;
          
          // Verificación de éxito
          if (nuevo_equipo.success === true && nuevo_equipo.total === 1) {
            console.log("✅ Webhook de máquina procesado");
            res.status(200).json({ message: "✅ Webhook de máquina procesado", data: equipo });

          } else {
            console.warn("⚠️ Advertencia: no se pudo procesar el webhook de máquina", nuevo_equipo);
            res.status(400).json({ message: "⚠️ Advertencia: la respuesta no fue la esperada", data: equipo });
          }
          
    }

}

module.exports = {
    nuevoEquipo
}
