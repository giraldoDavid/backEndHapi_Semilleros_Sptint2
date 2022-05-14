const Joi = require('@hapi/joi');
const { pool } = require('../config/dataBase');


module.exports = {
    name: "vehiculos",
    version: "1.0.0",
    register: async (server) => {
        server.route([
            {
                method: "GET",
                path: "/api/vehiculo",
                options:{
                    description: 'Servicio para validar conexión con vehículos',
                    tags:['api', 'Inicio', 'Vehículos'],
                    notes: ['Este servicio fue creado con la finalidad de validar la conexion de los servicios del vehículos'],
                    plugins: {
                        'hapi-swagger': {
                            responses: {
                                200: {description: 'Estas en la sección de Vehículos!'},
                            }
                        }
                    },
                },
                handler: (request, h) => {
                    return 'Estas en la sección de Vehículos!'
                },
            },
            {
                method: "GET",                                  // Peticion de los Vehículos
                path: "/api/vehiculos",
                options:{
                    description: 'Traer los Vehículos de la base de datos',
                    tags:['api', 'Inicio', 'Vehículos'],
                    notes: ['Este servicio trae los vehículos que se encuentan almacenados en la base de datos'],
                    plugins: {
                        'hapi-swagger': {
                            responses: {
                                200: {description: 'Respuesta positiva del servidor'},
                                508: {
                                    description: 'No se pudieron consultar los vehículos de la base de datos'
                                }
                            }
                        }
                    },
                },
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT * FROM vehiculos ORDER BY placa;`);
                        return result.rows
                        
                    } catch (err) {
                        console.log({ err })
                        return h.response({ error: 'No se pudieron consultar los vehículos de la base de datos' }).code(508)
                    } finally {
                        cliente.release(true)
                    }
                },
            },
            {
                method: "POST",                                 // Agregar un Vehículo
                path: "/api/vehiculos",
                options:{
                    description: 'Agregar un Vehículo',
                    tags:['api', 'Vehículos'],
                    plugins: {
                        'hapi-swagger': {
                            responses: {
                                200: {description: 'Respuesta positiva del servidor'},
                                508: {
                                    description: 'No se pudo agregar un vehículo a la base de datos'
                                }
                            },
                        }
                    },
                },
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                        const vehiculo = {
                            "placa": request.payload.placa,
                            "modelo": request.payload.modelo,
                            "venc_seguro": request.payload.venc_seguro,
                            "venc_tecnicomecanica": request.payload.venc_tecnicomecanica,
                            "color": request.payload.color,
                            "foto_vehiuclo": request.payload.foto_vehiuclo,
                            "id_linea": request.payload.id_linea
                        }
                    try {
                        await cliente.query(`
                        INSERT INTO vehiculos
                        VALUES ('${request.payload.placa}', ${request.payload.modelo}, '${request.payload.venc_seguro}', 
                            '${request.payload.venc_tecnicomecanica}', '${request.payload.color}', '${request.payload.foto_vehiculo}', ${request.payload.id_linea});
                            `)
                        const result = await cliente.query(`SELECT * FROM vehiculos WHERE placa='${ request.payload.placa }';`);
                        return result.rows;
                        
                    } catch (error) {
                        console.log(error);
                        return h.response({ error: 'No se pudo agregar un vehículo a la base de datos' }).code(508);
                    }
                    validate: {
                        payload: Joi.object({
                            placa: Joi.string().max(6).required,
                            modelo: Joi.number().max(4).required,
                            venc_seguro: Joi.date().required,
                            venc_tecnicomecanica: Joi.date().required,
                            foto_vehiuclo: Joi.string(),
                            color: Joi.string().required,
                            id_linea: Joi.number().required,
                        });
                    }
                },
            },
            {
                method: "PATCH",                                 // Editar un Vehículo
                path: "/api/vehiculos/{placa}",
                options:{
                    description: 'Editar un Vehículo',
                    tags:['api', 'Vehículos', 'PATCH'],
                    plugins: {
                        'hapi-swagger': {
                            responses: {
                                200: {description: 'Respuesta positiva del servidor'},
                                508: {
                                    description: 'No se puede editar el vehículo'
                                }
                            },
                        }
                    },
                },
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    
                    try {
                        const { placa } = request.params

                        const fields = Object.keys(request.payload);
                        const fieldsQuery = fields.map(field => {
                            if(typeof request.payload[`${field}`] === 'string'){
                                return `${field} = '${request.payload[`${field}`]}'`
                            }else{
                                return `${field} = ${request.payload[`${field}`]}`
                            }
                        })

                        await cliente.query(`UPDATE vehiculos SET ${fieldsQuery.join()} WHERE placa = '${placa}'`);
                        const vehiculo = await cliente.query(`SELECT * FROM vehiculos WHERE placa = '${placa}';`);
                        
                        return vehiculo.rows
                        
                    } catch (error) {
                        console.log(error);
                        return h.response({ error: 'No se puede editar el vehículo' }).code(508);
                    }
                    validate: {
                        payload: Joi.object({
                            modelo: Joi.number(),
                            venc_seguro: Joi.date(),
                            venc_tecnicomecanica: Joi.date(),
                            foto_vehiuclo: Joi.string(),
                            color: Joi.string(),
                            id_linea: Joi.number()
                        });
                    }
                }
            },
            {
                method: 'DELETE',                                   // Eliminar un vehiculo
                path: '/api/vehiculos/{placa}',
                options:{
                    description: 'Eliminar un Vehículo',
                    tags:['api', 'Vehículos', 'DELETE'],
                    plugins: {
                        'hapi-swagger': {
                            responses: {
                                200: {description: 'Respuesta positiva del servidor'},
                                508: {
                                    description: 'No se pudó eliminar el vehículo'
                                }
                            },
                        }
                    },
                },
                handler: async( request, h ) =>{
                    let cliente = await pool.connect();
                    const { placa } = request.params;

                    try {
                        await cliente.query(`DELETE FROM vehiculos WHERE placa = '${placa}';`)
                        return `vehiculo con placa: ${placa} eliminado satisfactoriamente`
                    } catch (error) {
                        console.log(error);
                        return h.response({ error: 'No se pudó eliminar el vehículo' }).code(508);
                    }
                }
            },
        ]);

    },
};
