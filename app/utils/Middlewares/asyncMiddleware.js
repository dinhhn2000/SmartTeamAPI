const responses = require("../Responses");
const models = require("../Models");

module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(async (err) => {
    // Handle errors of system
    err = { payload: err, dbError: false };

    // Handle errors of system
    if (err.errors !== undefined) {
      const transaction = await models.sequelize.transaction();
      await transaction.rollback();
      err = err.errors.map((error) => error.message);
      err = { payload: err, dbError: true };
    }

    return responses.errorNoMessage(res, err);
  });
};
