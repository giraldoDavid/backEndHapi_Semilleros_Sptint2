const Hapi = require('@hapi/hapi');
const path = require('path');
const Package = require('./package.json');
const Inert = require('@hapi/inert');
const Vision  = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const { description } = require('@hapi/joi/lib/base');

require('dotenv').config();



const init = async() =>{

    const server = new Hapi.Server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes:{
            cors: true,
        }
    });
    // Configure swagger
    const swaggerOptions = {
        info: {
            title: 'API REST Vheículos Semilleros S.A.S', 
            description: 'Esta es la documentación de la API Academia, creada en la sesión de clases de backend para demostrar el uso de Swagger', 
            contact: {
                name: 'David Giraldo Urrego ', 
                email: 'david.girald0@hotmail.com'
            }, 
            servers: [`${server.info.uri}`], 
            version: '0.0.1'
        }
    }
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            option: swaggerOptions
        }
    ]);

    server.route({
        method: 'GET',
        path: '/',
        options: {
            description: 'Comprobar conexión con el servior',
            tags: ['api', 'Inicio', 'Index'],
            
        },
        handler: (request, h) => {
            return 'Hello World!';
        },
    },
    );

    await server.register([
        require("./routes/vehiculos"),
        require("./routes/marcas"),
        require('./routes/lineas'),
        require("./routes/consultas")
    ]);

    
    //Inicialización del servidor Hapi
    await server.start();
    console.log(`Server running on: ${server.info.uri}`);


}

init();

// // Librerias de los Sockets
// const {createServer} = require("http");
// const { Server } = require("socket.io");

// // Servidor del Socket
// const httpServer = createServer()
// const io = new Server(httpServer, {/*Opciones de configuración*/})

// io.on("conection",(socket)=>{
//     console.log(socket.id);
// })
// httpServer.listen(process.env.PORT);