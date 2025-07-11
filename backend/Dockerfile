FROM python:alpine

COPY . /backend
COPY Pipfile /
COPY Pipfile.lock /
RUN apk update && apk add python3 py3-pip py3-virtualenv && pip install pipenv && pipenv install --ignore-pipfile