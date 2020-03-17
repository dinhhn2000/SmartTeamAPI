const { DataTypes, Deferrable } = require("sequelize");
const User = require("./users.model");
const Role = require("./roles.model");
const db = require("../utils/DB/db");

const User_Role = db.sequelize.define(
  "User_Role",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        // This is a reference to another model
        model: "Users",

        // This is the column name of the referenced model
        key: "id_user",

        // With PostgreSQL, it is optionally possible to declare when to check the foreign key constraint, passing the Deferrable type.
        deferrable: Deferrable.INITIALLY_DEFERRED
        // Options:
        // - `Deferrable.INITIALLY_IMMEDIATE` - Immediately check the foreign key constraints
        // - `Deferrable.INITIALLY_DEFERRED` - Defer all foreign key constraint check to the end of a transaction
        // - `Deferrable.NOT` - Don't defer the checks at all (default) - This won't allow you to dynamically change the rule in a transaction
      }
    },
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        // This is a reference to another model
        model: "Roles",

        // This is the column name of the referenced model
        key: "id_role",

        // With PostgreSQL, it is optionally possible to declare when to check the foreign key constraint, passing the Deferrable type.
        deferrable: Deferrable.INITIALLY_DEFERRED
        // Options:
        // - `Deferrable.INITIALLY_IMMEDIATE` - Immediately check the foreign key constraints
        // - `Deferrable.INITIALLY_DEFERRED` - Defer all foreign key constraint check to the end of a transaction
        // - `Deferrable.NOT` - Don't defer the checks at all (default) - This won't allow you to dynamically change the rule in a transaction
      }
    }
  },
  { freezeTableName: true }
);

User_Role.sync().then(async () => {
  try {
    // console.log("User_Role table created");
    await User_Role.findOrCreate({
      where: { id_user: 1 },
      defaults: {
        id_role: 1
      }
    });
  } catch (e) {
    console.log(e);
  }
});
module.exports = User_Role;
