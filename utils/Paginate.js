exports.PaginationsGenerate = (params) => {
  const page = parseInt(params.page) || 1;
  const size = parseInt(params.size) || 100;

  const startIndex = (page - 1) * size;

  const paginationParams = {
    ...params,
    page: startIndex,
    size: size,
  };

  return paginationParams;
};
