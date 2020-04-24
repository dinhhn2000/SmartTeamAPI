module.exports = {
  shortenName: (name) => {
    return name.replace(/\s/g, "");
  },

  convertTimestampToDATE: (date, fieldName) => {
    try {
      if (new Date(parseInt(date)).getTime() !== parseInt(date))
        throw {
          message: `${fieldName} is not in correct format, must be timestamp to miliseconds`,
        };
      let checkDate = moment(new Date(parseInt(date)));
      if (checkDate.isValid()) {
        const result = moment(new Date(parseInt(date))).format("YYYY-MM-DD");
        return result;
      }
    } catch (e) {
      if (e.message === undefined) throw e;
      else throw e.message;
    }
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
    // Some issue:
    // Cannot pass custom filter in query into filter.where
    // Because there will be some custom fields for query not for filter
    // filter.where = { ...filter.where, ...query };

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
