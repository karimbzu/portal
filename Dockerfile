### STAGE 1: Build ###
# Install the app dependencies in a full Node docker image
FROM node:12 AS build
# Install OS updates
WORKDIR /usr/src/app
COPY package*.json ./
COPY mdb-file-upload-8.3.1.tgz ./
RUN npm i @angular-devkit/build-angular@0.803.24
RUN npm install
COPY . .
RUN npm run build
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/portal /usr/share/nginx/html
