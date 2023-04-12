FROM node:18-slim

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app/

EXPOSE 3030

CMD npm start