FROM keymetrics/pm2:18-slim

RUN npm install -g pnpm

WORKDIR /app

COPY ["package.json", "pnpm-lock.yaml",  "./"]

RUN pnpm install

COPY prisma ./prisma/

RUN pnpm prisma generate

COPY . .

RUN pnpm build

RUN pnpm prune --prod

ENV NODE_ENV=production

RUN apt update && apt install curl -y

CMD pm2 start dist/main.js && pm2 logs