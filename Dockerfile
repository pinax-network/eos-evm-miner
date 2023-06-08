FROM node:alpine

EXPOSE 50305

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENTRYPOINT ["node", "dist/bin/cli.js"]