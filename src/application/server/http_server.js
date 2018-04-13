const express = require("express");
const fs = require("fs");
const path = require("path");
const util = require("util");

exports.make = function make(contentDir, notFoundPageToServe) {
  const httpServer = express();
  httpServer.use(express.static(contentDir));

  httpServer.use(function(req, res, next) {
    res.status(404).sendFile(path.join(__dirname, "../../..", contentDir));
  });

  return {
    start(portNumber) {
      const listenFn = httpServer.listen.bind(httpServer);
      const listenPromise = util.promisify(listenFn);
      return listenPromise(portNumber);
    },

    stop() {
      const closeFn = httpServer.close.bind(httpServer);
      const closePromise = util.promisify(closeFn);
      return closePromise();
    },

    getHttpServer() {
      return httpServer;
    }
  };
};
