FROM node:18-slim

RUN npm install -g pnpm nodemon

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .

ENV NODE_ENV=production

CMD pnpm build:node && nodemon build/index.js