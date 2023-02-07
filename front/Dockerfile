FROM node:18-slim

WORKDIR /app

COPY . .

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm build:node

FROM keymetrics/pm2:18-slim

WORKDIR /app

COPY --from=0 /app .

CMD ["pm2-runtime", "build/index.js"] 