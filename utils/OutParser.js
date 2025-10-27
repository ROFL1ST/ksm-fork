exports.OutSuccess = (data = null, messages = null) => {
  return {
    status: true,
    code: 200,
    data: data,
    messages: messages,
  };
};
exports.OutFailed = (data = null, messages = null) => {
  return {
    status: false,
    code: 201,
    data: data,
    messages: messages,
  };
};
