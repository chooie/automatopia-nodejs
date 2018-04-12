const http = require("http");
const fs = require("fs");
const send = require("send");
const util = require("util");

exports.make = function make(contentDir, notFoundPageToServe) {
  let httpServer = http.createServer();
  handleHttpRequests(httpServer, contentDir, notFoundPageToServe);

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

    getNodeServer() {
      return httpServer;
    }
  };
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
