# gRPC Task Manager

## Installation

### Create the docker network

```bash
docker network create grpc-task-manager_default
```

### Launch the databases and tracing tools

```bash
docker compose up -d mariadb mongo tracing
```

### Run the prisma migration
#### User-api

Set the .env :
```bash
MYSQL_URL="mysql://root:passwd@localhost:3306/user"
insecure=true
NODE_ENV=development
JAEGER_URL="http://localhost:14268/api/traces"
HEALTH_PORT=3001
AUTH_API_URL="localhost:4003"
```

```bash
npx prisma migrate dev
```
#### Auth-api

Set the .env :
```bash
MYSQL_URL="mysql://root:passwd@localhost:3306/auth"
PORT=4003
USER_API_URL="localhost:4002"
JWT_SECRET="super-secret"
insecure=true
JAEGER_URL="http://localhost:14268/api/traces"
ETCD_URL="http://localhost:8000"
HEALTH_PORT=3002
```

```bash
npx prisma migrate dev
```

