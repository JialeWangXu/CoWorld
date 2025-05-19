# CoWorld

Plataforma de Empleo para Personas con Discapacidad

## Description

CoWorld es una aplicación web desarrollada como Trabajo de Fin de Grado (TFG) del Grado en Ingeniería de Software en la Universidad Politécnica de Madrid, por Jiale Wang, con el objetivo de facilitar la búsqueda de empleo a personas con discapacidad.
A diferencia de las plataformas de empleo tradicionales, CoWorld está diseñada con un enfoque inclusivo, integrando funcionalidades que permiten a los usuarios encontrar con mayor eficiencia y precisión ofertas laborales adaptadas a sus necesidades.
El proyecto ha sido desarrollado utilizando el stack MongoDB, React, Node.js y el framework Next.js como base principal.

## Getting Started

### Dependencies

Antes de instalar el proyecto, asegúrate de tener los siguientes requisitos:

Node.js (v18 o superior)

MongoDB (local o en la nube, por ejemplo MongoDB Atlas)

ResendAPI

npm o yarn

Sistema operativo: Windows, Linux o macOS

### Installing

1. Clona este repositorio:
   
  - git clone https://github.com/JialeWangXu/CoWorld.git
  - cd CoWorld

2. Instala las dependencias: npm install
   
3. Configura las variables de entorno (.env):
   - MONGODB_URL
   - RESEND_KEY
   - ACCESS_TOKEN_SECRET 
   - REFRESH_TOKEN_SECRET
   - RESET_PWD_TOKEN_SECRETE
   - REACT_EDITOR=atom

### Executing program

1. Ejecuta la aplicación con el comando: npm run dev

2. Abre tu navegador y acceder a: http://localhost:3000

## Help

- Para que la aplicación funcione correctamente, es imprescindible tener bien configurado MongoDB y no olvidar configurar claves de token JWT para la parte de autenticación.

- Es probable que al abrir la aplicación por primera vez, en algunos archivos pages de la parte Front-end se muestre un aviso de que no se encuentra la ubicación del archivo style.module.scss. Este problema es común en SCSS y se debe ejecutar la aplicación para que reconozca las rutas de los archivos SCSS. Una vez levantada la aplicación por primera vez, los avisos desaparecen. 

## Author

- Jiale Wang
- https://github.com/JialeWangXu
- www.linkedin.com/in/jiale-wang-11a5342b3

## License

Este proyecto está licenciado bajo la licencia UPM ETSISI.

