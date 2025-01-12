FROM node:16-alpine

WORKDIR /frontend
COPY . /frontend

RUN npm i --force

ENTRYPOINT ["npm", "start"]
