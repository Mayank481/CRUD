FROM node:slim
WORKDIR /assigment
COPY . /assigment
RUN npm install
EXPOSE 4000
CMD [ "node", "app.js" ]
