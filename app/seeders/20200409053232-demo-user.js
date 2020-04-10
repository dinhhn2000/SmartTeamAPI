"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Create password
      let salt = await bcrypt.genSalt(10);
      let hashPassword = bcrypt.hashSync("Admin123", salt);

      // Create admins
      let admins = [];
      for (let i = 1; i < 6; i++) {
        let newAdmin = {
          idUser: i,
          firstName: `admin${i}`,
          lastName: `admin${i}`,
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRhJGAv0OMRd_2ksTNzn1AiE4gZRh3jr2oeOuAMo4YdBz5BGi3h&usqp=CAU",
          gender: "Not identify",
          email: `admin${i}@gmail.com`,
          password: hashPassword,
          is_verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        admins.push(newAdmin);
      }
      return queryInterface.bulkInsert("Users", admins);
      // return true;
    } catch (e) {
      console.log(e);
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
