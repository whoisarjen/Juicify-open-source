FROM node:19-alpine3.16

ENV PORT 80

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
COPY node_modules /usr/src/app/node_modules

RUN npm install
RUN npx prisma generate

COPY . /usr/src/app


EXPOSE 80