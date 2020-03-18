const { DataTypes } = require("sequelize");
const db = require("../utils/DB/db");

const Role = db.sequelize.define("Roles", {
  id_role: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: DataTypes.STRING }
});

// Role.sync().then(async () => {
//   try {
//     await Role.findOrCreate({
//       where: { id_role: 1 },
//       defaults: { name: "Super Admin" }
//     });
//     await Role.findOrCreate({
//       where: { id_role: 2 },
//       defaults: { name: "Admin" }
//     });
//     await Role.findOrCreate({
//       where: { id_role: 3 },
//       defaults: { name: "Member" }
//     });
//   } catch (e) {
//     console.log(e);
//   }
//   // console.log("Roles table created");
// });
module.exports = Role;
