const moment = require("moment");

module.exports = {
  convertDateToDATE: (date, fieldName) => {
    try {
      if (new Date(parseInt(date)).getTime() !== parseInt(date))
        throw { message: `${fieldName} is not in correct format, must be timestamp to miliseconds` };
      let checkDate = moment(new Date(parseInt(date)));
      if (checkDate.isValid()) {
        const result = moment(new Date(parseInt(date))).format("YYYY-MM-DD HH:mm:ss");
        return result;
      }
    } catch (e) {
      if (e.message === undefined) throw e;
      else throw e.message;
    }
  }
};
