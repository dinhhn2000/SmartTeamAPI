const moment = require("moment");

module.exports = {
  shortenNameHelper: name => {
    return require("./shortName.helper").shortenName(name);
  },

  convertDateToDATE: (date, fieldName) => {
    return require("./convertDateToDATE.helper").convertDateToDATE(date, fieldName);
  }
};
