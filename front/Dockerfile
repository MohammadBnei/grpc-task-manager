FROM node:18-slim

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .

ENV NODE_ENV=production

CMD pnpm build:node && node build/index.js