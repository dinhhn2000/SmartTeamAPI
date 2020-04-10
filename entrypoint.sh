#!/bin/sh

npx sequelize-cli db:migrate

npx sequelize-cli db:seed:all

nodemon app/bin/www