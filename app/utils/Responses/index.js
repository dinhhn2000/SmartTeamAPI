module.exports = {
  success: (response, message) => {
    return response.status(200).json({
      message,
      result: "OK"
    });
  },
  success: (response, message, payload) => {
    return response.status(200).json({
      message,
      result: "OK",
      payload
    });
  },
  created: (response, message) => {
    return response.status(201).json({
      message,
      result: "OK"
    });
  },
  created: (response, message, payload) => {
    return response.status(201).json({
      message,
      result: "OK",
      payload
    });
  },
  accepted: (response, message) => {
    return response.status(202).json({
      message,
      result: "OK"
    });
  },
  accepted: (response, message, payload) => {
    return response.status(202).json({
      message,
      result: "OK",
      payload
    });
  },
  error: (response, message) => {
    return response.status(400).json({
      message,
      result: "FAIL"
    });
  },
  error: (response, message, error) => {
    return response.status(400).json({
      message,
      result: "FAIL",
      error
    });
  }
};
