FROM mohammaddocker/pm2-nest-prisma

WORKDIR /app

COPY ["package.json", "pnpm-lock.yaml",  "./"]

RUN pnpm install --prod

COPY . .

RUN nest build

ENV NODE_ENV=production

CMD pm2 start dist/main.js && pm2 logs