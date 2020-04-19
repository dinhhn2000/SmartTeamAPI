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

  paginationQuery: (filter, query) => {
    // Handle custom filter in query
    filter.where = { ...filter.where, ...query };

    // Remove paginative property in filter
    delete filter.where.pageIndex;
    delete filter.where.limit;

    if (query.pageIndex !== undefined && query.limit !== undefined)
      return {
        hasPagination: true,
        pageIndex: query.pageIndex,
        query: {
          ...filter,
          raw: true,
          offset: (query.pageIndex - 1) * query.limit,
          limit: query.limit,
        },
      };
    else return { hasPagination: false, query: { ...filter, raw: true } };
  },

  listStructure: (currentPage, data, dataName) => {
    return {
      currentPage: parseInt(currentPage),
      totalRecords: data.count,
      [dataName]: data.rows,
    };
  },
};
