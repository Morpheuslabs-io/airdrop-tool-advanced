# build environment
FROM node:12.2.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY ./pm2 /app/pm2
COPY ./public /app/public
COPY ./src /app/src
COPY ./package.json /app/package.json

RUN npm i

# start app
CMD ["npm", "start"]
