# Rest Project + TypeScript

Este proyecto previamente inicializado tiene todo lo necesario para trabajar con TypeScript, Express y Rest.

Cada paso de su configuración ya se ha realizado previamente en el curso, por lo que solo es necesario clonar el proyecto y comenzar a trabajar.


## Instalación

1. Clonar .env.template a .env y configurar las variables de entorno
2. Ejecutar ` pnpm install ` para instalar las dependencias
3. Ejecutar ` npx prisma db pull ` para traer todo los cambios de las tablas de la base de datos y sincronizarlos con prisma
4. Ejecutar ` npx prisma generate ` para generar los modelos de prisma
5. Ejecutar ` pnpm run dev ` para levantar el proyecto en modo desarrollo

## Docker
1. Ejecutar  ` docker-compose up -d --build `
2. Desde table plus  connectarte a la base de datos  de docker y creer las tablas Puerto 5434
3. En el contenedor  vamosexpeditions-backend-app  Hecer el  `docker exec -it vamosexpeditions-backend-app pnpm seed` 


## Llenado de datos en la db

1. Ejecutar ` pnpm seed ` para llenar datos de prueba en la base de datos
