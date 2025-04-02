FROM node:20.17.0-bullseye AS dev

WORKDIR /app

# Instalar PNPM globalmente
RUN npm install -g pnpm

# Copiar package.json
COPY package.json  pnpm-lock.yaml ./

# Instalar dependencias sin frozen-lockfile
RUN pnpm install  


COPY . .

RUN npx prisma generate

EXPOSE 8000

CMD ["pnpm", "dev"]
