FROM keymetrics/pm2:18-slim

RUN npm install -g pnpm @nestjs/cli prisma

RUN apt update && apt install curl -y
