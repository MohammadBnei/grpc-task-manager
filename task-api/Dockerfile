FROM node:18-slim

RUN npm install -g pnpm

WORKDIR /app

COPY ["package.json", "pnpm-lock.yaml",  "./"]

RUN pnpm install

COPY . .

RUN pnpm build

RUN pnpm prune --prod

FROM keymetrics/pm2:18-slim

ENV NODE_ENV=production

WORKDIR /app

COPY --from=0 /app/dist ./dist
COPY --from=0 /app/node_modules ./node_modules

RUN apt update && apt install curl -y

CMD pm2 start dist/main.js && pm2 logs