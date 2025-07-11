FROM node:alpine AS build

COPY . /app
WORKDIR /app
ENV VITE_DOCKER="true"
RUN npm i && npm run build

FROM nginx:alpine AS main

COPY --from=build /app/build /static
COPY nginx.conf /etc/nginx/nginx.conf