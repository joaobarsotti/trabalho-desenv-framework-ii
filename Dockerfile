FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

<<<<<<< HEAD:DockerFile
EXPOSE 3000
=======
EXPOSE 8080

>>>>>>> aa722056e48d4d339b52576f44647182c4d1bd84:Dockerfile

CMD [ "node", "server.js" ]
