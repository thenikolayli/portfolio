FROM python:slim

# use build time variables (ENV variable)
# copy ENV argument to .env file inside of the container
# copy frontend and backend directories into the container on the same level as the .env file
ARG ENV
COPY ${ENV} .env
COPY ./frontend ./frontend
COPY ./backend ./backend

# sets the viteindocker env variable, so the /static/ prefix is added to every file
ARG VITEINDOCKER
ENV VITEINDOCKER = ${VITEINDOCKER}

# updates and installs required packages
RUN apt-get update -y && apt-get install pipenv npm nodejs -y

# goes into frontend to build
WORKDIR /frontend
# installed node modules and builds the frontend
RUN npm install && npm run build

# goes into backend to set up backend and gunicorn workers
WORKDIR /backend
# sets python path for pipenv and creates virtual environment
RUN pipenv --python /usr/bin/python3 && pipenv install
# creates migrations, migrates models to db, collects static to static folder (for nginx), and creates group for keyclubbot permissions
RUN pipenv run python3 manage.py makemigrations --no-input && pipenv run python3 manage.py migrate --no-input && pipenv run python3 manage.py collectstatic --no-input && pipenv run python3 manage.py creategroup
# creates a gunicorn server bind to 0.0.0.0:8000 with 3 workers
CMD ["pipenv", "run", "gunicorn", "base.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]