### STAGE 1: Build ###
# Install the app dependencies in a full Node docker image
FROM node:12 AS build
# Install OS updates
RUN apt-get update \
 && apt-get dist-upgrade -y \
 && apt-get clean \
 && echo 'Finished installing dependencies'
WORKDIR /usr/src/app
COPY package*.json ./
COPY mdb-file-upload-8.3.1.tgz ./
RUN npm install && npm audit fix
COPY . .
RUN npm run build
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/portal /usr/share/nginx/html
