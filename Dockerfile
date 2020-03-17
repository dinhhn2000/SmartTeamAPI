FROM node:10

RUN mkdir /src

RUN npm install express-generator -g
RUN npm install nodemon -g

WORKDIR /src
ADD app/package.json /src/package.json
RUN npm install

EXPOSE 3000

CMD nodemon app/bin/www