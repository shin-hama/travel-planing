FROM node:lts-slim as base

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN apt-get update

FROM base as development

RUN apt-get install --no-install-recommends -y git && \
    yarn install && \
    yarn cache clean

FROM base as production

RUN yarn --production --frozen-lockfile
