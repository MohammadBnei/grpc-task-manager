FROM node:18-slim

RUN npm install -g pnpm nodemon

WORKDIR /app

COPY . .

RUN pnpm install

CMD pnpm build:node && nodemon build/index.js