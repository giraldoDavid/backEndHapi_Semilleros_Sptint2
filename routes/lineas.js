const Joi = require('joi');
const { pool } = require('../config/dataBase');

module.exports = {
    name: "lineas",
    version: "1.0.0",
    register: async (server) => {
        server.route([
            {
                method: "GET",
                path: "/api/linea",
                options:{
                    description: 'Comprobar conexión con lineas',
                    tags:['api', 'Linea', 'GET'],
                    plugins: {
                        'hapi-swagger': {
                            responses: {
                                200: {description: 'Respuesta positiva del servidor'},
                            },
                        }
                    },
                },
                handler: (request, h) => {
                    return 'Estas en la sección de Lineas!'
                }
            },
            {
                method: "GET",                                  // Peticion de las marcas
                path: "/api/lineas",
                options:{
                    description: 'Peticion de las marcas',
                    tags:['api', 'Lineas', 'GET'],
                    plugins: {
                        'hapi-swagger': {
                            responses: {
                                200: {description: 'Respuesta positiva del servidor'},
                                508: {
                                    description: 'No se pudieron consultar las lineas de la base de datos'
                                }
                            },
                        }
                    },
                },
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT * FROM lineas;`);
                        return result.rows
                        
                    } catch (err) {
                        console.log({ err })
                        return h.code(508).response({ error: 'No se pudieron consultar las lineas de la base de datos' })
                    } finally {
                        cliente.release(true)
                    }
                    validate: {
                        payload: Joi.object({
                            nombre: Joi.string().max(30).required,
                            descripcion: Joi.string().required,
                            linea_activa: Joi.string().max(4).required,
                            id_marca: Joi.number(). required,
                        })
                    }
                }
            },
            {
                method: "PATCH",                                 // Editar una Linea
                path: "/api/lineas/{id}",
                options:{
                    description: 'Editar una Linea',
                    tags:['api', 'Lineas', 'PATCH'],
                    plugins: {
                        'hapi-swagger': {
                            responses: {
                                200: {description: 'Respuesta positiva del servidor'},
                                508: {
                                    description: 'No se puede editar la linea'
                                }
                            },
                        }
                    },
                },
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    
                    try {
                        const { id } = request.params

                        const fields = Object.keys(request.payload);
                        const fieldsQuery = fields.map(field => {
                            if(typeof request.payload[`${field}`] === 'string'){
                                return `${field} = '${request.payload[`${field}`]}'`
                            }else{
                                return `${field} = ${request.payload[`${field}`]}`
                            }
                        })

                        await cliente.query(`UPDATE lineas SET ${fieldsQuery.join()} WHERE id = '${id}'`);
                        const lineas = await cliente.query(`SELECT * FROM lineas WHERE id = '${id}';`);
                        
                        return lineas.rows
                        
                    } catch (error) {
                        console.log(error);
                        return h.response({ error: 'No se puede editar la linea' }).code(508);
                    }
                    validate: {
                        payload: Joi.object({
                            nombre: Joi.string().max(30).required,
                            descripcion: Joi.string().required,
                            linea_activa: Joi.string().max(4).required,
                            id_marca: Joi.number(). required,
                        })
                    }
                }
            },
            {
                method: "GET",                                  // Peticion de las lineas activas
                path: "/api/lineas/activas",
                options:{
                    description: 'Peticion de las lineas activas',
                    tags:['api', 'Lineas', 'GET'],
                    plugins: {
                        'hapi-swagger': {
                            responses: {
                                200: {description: 'Respuesta positiva del servidor'},
                                508: {
                                    description: 'No se pudieron consultar las lineas activas'
                                }
                            },
                        }
                    },
                },
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT * FROM lineas WHERE linea_activa = 'Si';`);
                        return result.rows
                        
                    } catch (err) {
                        console.log({ err })
                        return h.code(508).response({ error: 'No se pudieron consultar las lineas activas' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "GET",                                  // Peticion de las lineas inactivas
                path: "/api/lineas/inactivas",
                options:{
                    description: 'Peticion de las lineas inactivas',
                    tags:['api', 'Lineas', 'GET'],
                    plugins: {
                        'hapi-swagger': {
                            responses: {
                                200: {description: 'Respuesta positiva del servidor'},
                                508: {
                                    description: 'No se pudieron consultar las lineas inactivas'
                                }
                            },
                        }
                    },
                },
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT * FROM lineas WHERE linea_activa = 'No';`);
                        return result.rows
                        
                    } catch (err) {
                        console.log({ err })
                        return h.code(508).response({ error: 'No se pudieron consultar las lineas inactivas' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "POST",                                 // Agregar una Marca
                path: "/api/lineas",
                options:{
                    description: 'Agregar una Marca',
                    tags:['api', 'Lineas', 'POST'],
                    plugins: {
                        'hapi-swagger': {
                            responses: {
                                200: {description: 'Respuesta positiva del servidor'},
                                508: {
                                    description: 'No se pudó agregar una linea'
                                }
                            },
                        }
                    },
                },
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    const { nombre } = request.payload
                    try {
                        await cliente.query(`
                        INSERT INTO lineas (id, nombre, descripcion, linea_activa, id_marca)
                        VALUES (NEXTVAL ('id_linea_seq'), '${request.payload.nombre}', '${request.payload.descripcion}', 
                            '${request.payload.linea_activa}', ${request.payload.id_marca});
                            `)
                        const result = await cliente.query(`SELECT * FROM lineas WHERE nombre = '${ nombre }';`);
                        return result.rows;
                    } catch (error) {
                        console.log(error);
                        return h.response({ error: 'No se pudó agregar una linea' }).code(508);
                    }
                }
            },
        ])
    }
}