FROM node:current

EXPOSE 50305

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

ENTRYPOINT ["node", "dist/bin/cli.js"]