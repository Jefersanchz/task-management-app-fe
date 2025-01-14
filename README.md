# TaskManager

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.13.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.



## Instalación

Ejecuta el siguiente comando en la raíz del proyecto para instalar las dependencias necesarias:

```bash
npm install
```

## Servidor de Desarrollo (Frontend)

Ejecuta `ng serve` para iniciar un servidor de desarrollo. Navega a `http://localhost:4200/` en tu navegador. La aplicación se recargará automáticamente al detectar cambios en los archivos fuente.

```bash
ng serve
```
## Base de Datos (RDS en AWS)

La base de datos se encuentra alojada en Amazon RDS. Asegúrate de configurar las variables de entorno para que el backend se conecte correctamente a esta base de datos.

## Despliegue en AWS

### Frontend

El frontend está desplegado en un Bucket S3 configurado para alojamiento estático.

### Backend

El backend está ejecutándose en una instancia EC2, utilizando `screen` para mantener el servicio en ejecución.

### Base de Datos

La base de datos utiliza Amazon RDS. Configura el acceso y las variables de entorno necesarias para que el backend pueda conectarse a la base de datos.

## Comandos Útiles

- **ng serve**: Inicia el servidor de desarrollo.
- **ng build**: Construye el proyecto.
- **ng test**: Ejecuta pruebas unitarias con Karma.
- **ng e2e**: Ejecuta pruebas de extremo a extremo.

## Rutas AWS Frontend
http://taskm.s3-website.us-east-2.amazonaws.com/

## Ruta AWS Documentación apis
http://ec2-3-149-251-150.us-east-2.compute.amazonaws.com:9000/swagger-ui/index.html#/