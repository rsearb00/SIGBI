# TapO'N - Sistema de recomendación de bares y tapas
Autor: Raúl Seara Barroso

Repositorio de la práctica de la asignatura de SIGBI de 4º de Ingeniería Informática

Instrucciones para ejecutar la aplicación una vez descargado el contenido del repositorio.

Es importante hacer todo en el orden indicado para no tener problemas




- Base de datos (instrucciones para hacerlo con Neo4j Desktop):

1 - En primer lugar, hay que instalar Neo4j desde la página https://neo4j.com/download-v2/
La versión con la que está probada la aplicación es la 4.1.1 (importante)

2 - Una vez instalado, en la pantalla de Inicio de Neo4j, tenemos que crear un nuevo proyecto y añadir una base de datos. Metemos la contraseña "1234".

3 - Una vez añadida la base, tenemos que darle al botón Start para que inicie y cuando esté arrancada, le damos a Open para abrir el Browser

4 - Copiamos TODO el texto que está en el txt del repositorio llamado "BaseNEO4J", lo pegamos en el cuadro de consulta y ejecutamos.

5 - En principio, estaría la base cargada. Para que funcione la aplicación, hay que dejar abierta la base de Neo4j. 
(el browser no hace falta tenerlo abierto, pero sirve para ver cómo se ejecutan nuestras acciones desde la aplicación)



- Backend
Los pasos a seguir en este punto son fáciles:

1 - Acceder mediante una terminal a la ubicación donde hemos descargado el repositorio

2 - Ahora, hacer cd a la carpeta Backend

3 - Ejecutar el comando "npm install" (instalará los módulos necesarios para ejecutar la aplicación)

4 - Para arrancar el back, una vez acabe la instalación, hacer "node app.js"





- Frontend
Los pasos a seguir en este punto son similares a los del back:

1 - Acceder mediante una terminal a la ubicación donde hemos descargado el repositorio

2 - Ahora, hacer cd a la carpeta Frontend

3 - Ejecutar el comando "npm install" (instalará los módulos necesarios para ejecutar la aplicación)

4 - Para arrancar la aplicación como un ejecutable, una vez acabe la instalación, hacer "npm run electron:serve"


Para que funcione es necesario que estén corriendo tanto el back como el front y tener iniciada nuestra base en Neo4j
