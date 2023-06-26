FROM node:19-alpine3.16

ENV PORT 3000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
COPY node_modules /usr/src/app/node_modules
COPY next.config.js /usr/src/app/next.config.js
COPY .env /usr/src/app/.env

RUN npm install
RUN npx prisma generate

COPY . /usr/src/app

EXPOSE 3000