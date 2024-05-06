# Prueba - Acceso a datos en aplicaciones Node
## Descripción
En esta prueba validaremos nuestros conocimientos de Conectar una base de datos
PostgreSQL con Node, Realizar consultas DML con Node y el paquete pg, Realizar consultas
TCL con Node y el paquete pg, Construir una API RESTful utilizando PostgreSQL para la
persistencia de datos, Manejar errores y Manejar códigos de estado HTTP.
## Tecnologías Utilizadas
- NODE
- PostgreSQL
## Requerimientos
1. Utilizar el paquete pg para conectarse a PostgreSQL y realizar consultas DML para la
gestión y persistencia de datos. (3 Puntos)
2. Usar transacciones SQL para realizar el registro de las transferencias. (2 Puntos)
3. Servir una API RESTful en el servidor con los datos de los usuarios almacenados en
PostgreSQL. (3 Puntos)
4. Capturar los posibles errores que puedan ocurrir a través de bloques catch o
parámetros de funciones callbacks para condicionar las funciones del servidor. (1
Punto)
5. Devolver correctamente los códigos de estado según las diferentes situaciones

## Instrucciones
  1. instala dependencias
  2. Crea base de datos
CREATE DATABASE bancosolar;
CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(50),
balance FLOAT CHECK (balance >= 0));
CREATE TABLE transferencias (id SERIAL PRIMARY KEY, emisor INT, receptor
INT, monto FLOAT, fecha TIMESTAMP, FOREIGN KEY (emisor) REFERENCES
usuarios(id), FOREIGN KEY (receptor) REFERENCES usuarios(id));
  4. Ejecuta servidor: node index.js
