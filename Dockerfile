#!/bin/bash

FROM node:14

WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/

RUN yarn install
RUN apt update -y
RUN apt install -y redis-server wget
RUN service redis-server start

COPY . /app

EXPOSE 4000

CMD ["yarn", "start"]