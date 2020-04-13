module.exports = {
  shortenName: (name) => {
    return require("./shortName.helper").shortenName(name);
  },

  convertDateToDATE: (date, fieldName) => {
    return require("./convertDateToDATE.helper").convertDateToDATE(date, fieldName);
  },

  roundPoints: function (points) {
    return Math.round(points * 4) / 4;
  },

  isBeforeOrEqualThan: (dateBefore, dateAfter) => {
    if (new Date(dateAfter) >= new Date(dateBefore)) return true;
    return false;
  },

  sumArray: (arr) => arr.reduce((a, b) => a + b, 0),

  listStruture: (currentPage, totalRecords, data, dataName) => {
    return { currentPage: parseInt(currentPage), totalRecords, [dataName]: data };
  },
};
