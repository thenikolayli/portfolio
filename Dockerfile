FROM node:alpine AS build

COPY ./backend /backend
COPY ./frontend /frontend

# installs and builds the frontend
ENV VITE_DOCKER="true"
WORKDIR /frontend
RUN npm install && npm run build

FROM python:alpine AS main

# installs dependencies and runs
COPY --from=build /backend /backend
WORKDIR /backend
RUN apk update && apk add python3 py3-pip py3-virtualenv && pip install pipenv && pipenv install --ignore-pipfile
