FROM node:alpine AS build

COPY . /app
WORKDIR /app

RUN npm install && npm run build

FROM node:alpine AS main

COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules

WORKDIR /app