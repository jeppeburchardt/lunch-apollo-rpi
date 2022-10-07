# syntax=docker/dockerfile:1
FROM node:slim

WORKDIR /web/

COPY ./package.json ./package.json
RUN npm install
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
COPY ./tslint.json ./tslint.json
RUN npm run build

CMD npm run start