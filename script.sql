
DROP DATABASE IF EXISTS sprint_backend_2;

CREATE DATABASE sprint_backend_2 WITH 
ENCODING = 'UTF8';

\c sprint_backend_2

-- Eliminación de tablas
DROP TABLE IF EXISTS vehiculos;
DROP TABLE IF EXISTS lineas;
DROP TABLE IF EXISTS marcas;

-- Eliminación de secuencias
DROP SEQUENCE IF EXISTS id_marca_seq;
DROP SEQUENCE IF EXISTS id_linea_seq;

-- Eliminación de enumeracíon
DROP TYPE IF EXISTS enum_marca;
DROP TYPE IF EXISTS enum_linea;

--MARCAS
CREATE SEQUENCE id_marca_seq;
CREATE TYPE enum_marca AS ENUM ('Si', 'No');

CREATE TABLE marcas(
    id INTEGER NOT NULL DEFAULT NEXTVAL('id_marca_seq'),
    nombre VARCHAR(30) NOT NULL,
    descripcion TEXT NOT NULL,
    marca_activa enum_marca NOT NULL,
    CONSTRAINT pk_id_marca
        PRIMARY KEY (id)
);

--LINEAS
CREATE SEQUENCE id_linea_seq;
CREATE TYPE enum_linea AS ENUM ('Si', 'No');

CREATE TABLE lineas(
    id INTEGER NOT NULL DEFAULT NEXTVAL('id_linea_seq'),
    nombre VARCHAR(30) NOT NULL,
    descripcion TEXT NOT NULL,
    linea_activa enum_linea NOT NULL,
    id_marca INT4 NOT NULL,
    CONSTRAINT pk_id_linea
        PRIMARY KEY (id),
    CONSTRAINT fk_id_marca
        FOREIGN KEY (id_marca) REFERENCES marcas (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

--VEHICULOS

CREATE TABLE vehiculos (
    placa VARCHAR(6) NOT NULL,
    modelo INT4 NOT NULL,
    venc_seguro DATE NOT NULL,
    venc_tecnicomecanica DATE NOT NULL,
    color VARCHAR(20),
    foto_vehiculo TEXT,
    id_linea INT4 NOT NULL,
    CONSTRAINT pk_placa PRIMARY KEY(placa),
    CONSTRAINT fk_id_linea
        FOREIGN KEY (id_linea) REFERENCES lineas (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

--Agregar Datos Base
--Marcas
INSERT INTO marcas
    VALUES(NEXTVAL ('id_marca_seq'),'Renoult', 'Marca francesa, recomendados.', 'Si');
INSERT INTO marcas
    VALUES(NEXTVAL ('id_marca_seq'), 'Mazda', 'Mazda Motor Corporation es un fabricante de automóviles japonés, fundada en 1920.', 'No');
INSERT INTO marcas
    VALUES(NEXTVAL ('id_marca_seq'), 'Ford', 'Ford Motor Company, más conocida como Ford, es una empresa multinacional de origen estadounidense.', 'Si');
INSERT INTO marcas
    VALUES(NEXTVAL ('id_marca_seq'), 'Kia Motors', 'Kia Motors es un fabricante surcoreano de automóviles. Su sede central está ubicada en Yangjae-dong.', 'Si');

--Lineas
INSERT INTO lineas
    VALUES(NEXTVAL ('id_linea_seq'), 'Sandero', 'Motor 1600, gasolina, 4 puertas', 'Si', 1);
INSERT INTO lineas
    VALUES(NEXTVAL ('id_linea_seq'), 'Explorer', 'Potencia 300hp, 7 asientos 4x4', 'Si', 3);
INSERT INTO lineas
    VALUES(NEXTVAL ('id_linea_seq'), 'Niro', 'Híbrida por dentro, elegante por fuera, Transmisión Automática', 'Si', 4);
INSERT INTO lineas
    VALUES(NEXTVAL ('id_linea_seq'), 'Fiesta', 'Too rapido!', 'No', 3);

--Vehículos
INSERT INTO vehiculos
    VALUES('IAU521', 2015, '2022/07/30', '2022/07/31', 'Gris Beige', 'Esta es la foto!', 1);
INSERT INTO vehiculos
    VALUES('TJZ742', 2020, '2022/09/20', '2022/10/02', 'Blanco', 'Esta es otra la foto!', 3);



--Consultas
--Mayor y Menor modelo
    SELECT MIN(modelo) AS "Menor_Modelo", MAX(modelo) AS "Mayor_Modelo" FROM vehiculos;

--Consultar vehículo segín el rando de la fecha del seguro
    SELECT * FROM vehiculos WHERE venc_seguro BETWEEN '2022-07-10' AND '2022-10-09' ORDER BY venc_seguro;

--vehículos según el rango de modelo
    SELECT * FROM vehiculos WHERE modelo BETWEEN 2010 AND 2018 ORDER BY modelo;

--Consulta de la placa, modelo descripción de la línea y descripción del modelo (línea este activa)
    SELECT placa, modelo, L.descripcion AS "desLinea", M.descripcion AS "desMarca" FROM vehiculos V
                JOIN lineas L ON V.id_linea = L.id
                JOIN marcas M ON L.id = M.id
                WHERE L.linea_activa = 'Si' ORDER BY placa;

--Suma de los modelos
    SELECT SUM(modelo) AS "sumModelo" FROM vehiculos;

--Promedio de los modelos
    SELECT AVG(modelo) AS "promModelo" FROM vehiculos;

--Lineas activas e inactivas
    SELECT COUNT(linea_activa), linea_activa FROM lineas GROUP BY linea_activa;