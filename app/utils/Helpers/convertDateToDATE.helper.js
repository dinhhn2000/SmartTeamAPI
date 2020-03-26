module.exports = {
  convertDateToDATE: (date, fieldName) => {
    try {
      if (new Date(parseInt(date)).getTime() !== parseInt(date))
        throw { message: `${fieldName} is not in correct format, must be timestamp` };
      let checkDate = moment(new Date(parseInt(date)));
      if (checkDate.isValid()) {
        const result = moment(new Date(parseInt(date))).format("YYYY-MM-DD HH:mm:ss");
        return result;
      }
    } catch (e) {
      throw e.message;
    }
  }
};
