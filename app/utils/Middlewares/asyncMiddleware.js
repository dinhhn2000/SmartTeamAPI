const responses = require("../Responses");
const models = require("../Models");

module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(async (err) => {
    console.log(err);
    
    // Handle errors of system
    if (err.message !== undefined) {
      const transaction = await models.sequelize.transaction();
      await transaction.rollback();
      err = { payload: err.message, dbError: true };
    }
    // Handle errors of clients
    else err = { payload: err, dbError: false };

    return responses.errorNoMessage(res, err);
  });
};
