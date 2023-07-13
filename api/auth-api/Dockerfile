FROM mohammaddocker/nest-prisma

WORKDIR /app

COPY ["package.json", "pnpm-lock.yaml",  "./"]

RUN pnpm install --prod

COPY prisma ./prisma/

RUN prisma generate

COPY . .

RUN nest build

ENV NODE_ENV=production

COPY src/proto dist/proto

CMD pnpm start:prod
