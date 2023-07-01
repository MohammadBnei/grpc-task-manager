FROM mohammaddocker/nest-prisma

WORKDIR /app

COPY ["package.json",  "./"]

RUN pnpm install

COPY prisma ./prisma/

RUN prisma generate

COPY . .

COPY src/proto dist/proto

CMD pnpm start:dev
