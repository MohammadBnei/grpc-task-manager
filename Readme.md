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
JAEGER_URL="http://localhost:4318/v1/traces"
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
JAEGER_URL="http://localhost:4318/v1/traces"
HEALTH_PORT=3002
```

```bash
npx prisma migrate dev
```

## SSL

### Install mkcert 

https://github.com/FiloSottile/mkcert

### Certificates and rootCA

```bash
mkcert user-api localhost
mkcert auth-api localhost
mkcert task-api localhost
mkcert front localhost
cp $(mkcert -CAROOT)/rootCA.pem .
```

Remove the +1 part of the name of the certificates 

## Front

### example .env

```bash
ROOT_CA=../local/certs/rootCA.pem
FRONT_KEY=../local/certs/front-key.pem
FRONT_CERT=../local/certs/front.pem
secure=false
TASK_API_URL=localhost:4001
AUTH_API_URL=localhost:4002
USER_API_URL=localhost:4000
```

## Start the servers

```bash
docker compose up -d
```

| **Name**         | **Url**                |
|------------------|------------------------|
| project          | http://localhost:4000  |
| observability ui | http://localhost:16686 |
