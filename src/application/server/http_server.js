(function() {
  "use strict";

  const http = require("http");
  const fs = require("fs");
  const send = require("send");
  const util = require("util");

  module.exports = class HttpServer {
    constructor(contentDir, notFoundPageToServe) {
      this._httpServer = http.createServer();

      handleHttpRequests(this._httpServer, contentDir, notFoundPageToServe);
    }

    start(portNumber) {
      const listenFn = this._httpServer.listen.bind(this._httpServer);
      const listenPromise = util.promisify(listenFn);
      return listenPromise(portNumber);
    }

    stop() {
      var closeFn = this._httpServer.close.bind(this._httpServer);
      const closePromise = util.promisify(closeFn);
      return closePromise();
    }

    getNodeServer() {
      return this._httpServer;
    }
  };

  function handleHttpRequests(httpServer, contentDir, notFoundPageToServe) {
    httpServer.on("request", function(request, response) {
      send(request, request.url, { root: contentDir })
        .on("error", handleError)
        .pipe(response);

      function handleError(err) {
        if (err.status === 404) {
          serveErrorFile(response, 404, contentDir + "/" + notFoundPageToServe);
        } else {
          throw err;
        }
      }
    });
  }

  function serveErrorFile(response, statusCode, file) {
    response.statusCode = statusCode;
    response.setHeader("Content-Type", "text/html; charset=UTF-8");
    fs.readFile(file, function(err, data) {
      if (err) throw err;
      response.end(data);
    });
  }
})();
