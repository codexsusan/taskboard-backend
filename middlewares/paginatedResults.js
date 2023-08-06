exports.paginatedResults = (model) => {
  return async (req, res, next) => {
    const { page, limit } = req.query;
    const startIndex = parseInt((page - 1) * limit);
    const endIndex = parseInt(page * limit);
    const results = {};
    const allData = await model.findAll();
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    if (endIndex < allData.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    results.results = allData.slice(startIndex, endIndex);
    res.paginatedResults = results;
    res.dataLength = allData.length;
    next();
  };
};
