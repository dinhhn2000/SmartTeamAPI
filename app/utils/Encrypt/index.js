"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  getSalt: async () => {
    return await bcrypt.genSalt(10);
  },
  bcrypt
};
