FROM mohammaddocker/pm2-nest-prisma

WORKDIR /app

COPY ["package.json", "pnpm-lock.yaml",  "./"]

RUN pnpm install --prod

COPY . .

RUN nest build

ENV NODE_ENV=production

CMD pnpm start:prod