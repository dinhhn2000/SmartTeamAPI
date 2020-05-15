"use strict";
module.exports = {
  success: (response, message, payload) => {
    if (typeof payload !== "undefined")
      return response.status(200).json({
        message,
        result: "OK",
        payload,
      });
    else
      return response.status(200).json({
        message,
        result: "OK",
      });
  },
  created: (response, message, payload) => {
    if (typeof payload !== "undefined")
      return response.status(201).json({
        message,
        result: "OK",
        payload,
      });
    else
      return response.status(201).json({
        message,
        result: "OK",
      });
  },
  accepted: (response, message, payload) => {
    if (typeof payload !== "undefined")
      return response.status(202).json({
        message,
        result: "OK",
        payload,
      });
    else
      return response.status(202).json({
        message,
        result: "OK",
      });
  },
  error: (response, message, error) => {
    console.log(error);
    if (Array.isArray(error)) error = error[0];
    if (typeof error !== "undefined")
      if (typeof error.message === "undefined")
        return response.status(400).json({
          message,
          result: "FAIL",
          error,
        });
      else
        return response.status(400).json({
          message,
          result: "FAIL",
          error: error.message,
        });
    else
      return response.status(400).json({
        message,
        result: "FAIL",
      });
  },
  errorNoMessage: (response, error) => {
    console.log(error);
    if (Array.isArray(error)) error = error[0];
    if (typeof error !== "undefined")
      if (typeof error.message === "undefined")
        return response.status(400).json({
          dbError: error.dbError,
          result: "FAIL",
          error: error.payload,
        });
      else
        return response.status(400).json({
          dbError: error.dbError,
          result: "FAIL",
          error: error.payload.message,
        });
    else
      return response.status(400).json({
        dbError: error.dbError,
        result: "FAIL",
      });
  },
  unauthorized: (response, message) => {
    return response.status(401).json({
      message,
      result: "FAIL",
    });
  },
};
