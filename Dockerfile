FROM node:13.10.1-alpine3.10

RUN mkdir /src

RUN npm install express-generator -g
RUN npm install nodemon -g
RUN npm install sequelize-cli -g

WORKDIR /src

COPY app/package.json /src/package.json
COPY app/config /src/config
COPY app/migrations /src/migrations
COPY app/seeders /src/seeders


RUN npm install
# RUN sequelize init

EXPOSE 3000

COPY ./wait-for-it.sh /src/wait-for-it.sh

RUN chmod +x /src/wait-for-it.sh

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

# ENTRYPOINT ["/entrypoint.sh"]

CMD nodemon app/bin/www