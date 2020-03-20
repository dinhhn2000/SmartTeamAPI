FROM node:13.10.1-alpine3.10

RUN mkdir /src

RUN npm install express-generator -g
RUN npm install nodemon -g

WORKDIR /src
ADD app/package.json /src/package.json
ADD app/wait-for-it.sh /src/wait-for-it.sh
RUN npm install

EXPOSE 3000

CMD nodemon app/bin/www