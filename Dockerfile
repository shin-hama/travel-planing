FROM node:lts-slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN apt-get update && \
    yarn install && \
    yarn cache clean

COPY . .

RUN yarn run build
