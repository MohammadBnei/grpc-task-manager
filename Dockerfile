FROM node:18-slim

RUN npm install -g pnpm

WORKDIR /app

COPY ./server ./server

RUN cd server && pnpm install

RUN cd server && pnpm build

COPY ./front ./front

RUN cd front && pnpm install

RUN cd front && pnpm build:node

FROM keymetrics/pm2:18-slim

WORKDIR /app

COPY --from=0 /app .

COPY ecosystem.config.js .

CMD pm2 start ecosystem.config.js && pm2 logs