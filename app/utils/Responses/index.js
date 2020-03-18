"use strict";
module.exports = {
  success: (response, message, payload) => {
    if (typeof payload !== "undefined")
      return response.status(200).json({
        message,
        result: "OK",
        payload
      });
    else
      return response.status(200).json({
        message,
        result: "OK"
      });
  },
  created: (response, message, payload) => {
    if (typeof payload !== "undefined")
      return response.status(201).json({
        message,
        result: "OK",
        payload
      });
    else
      return response.status(201).json({
        message,
        result: "OK"
      });
  },
  accepted: (response, message, payload) => {
    if (typeof payload !== "undefined")
      return response.status(202).json({
        message,
        result: "OK",
        payload
      });
    else
      return response.status(202).json({
        message,
        result: "OK"
      });
  },
  error: (response, message, error) => {
    if (typeof error !== "undefined")
      return response.status(400).json({
        message,
        result: "FAIL",
        error
      });
    else
      return response.status(400).json({
        message,
        result: "FAIL"
      });
  }
};
