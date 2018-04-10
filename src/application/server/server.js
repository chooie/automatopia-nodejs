(function() {
  "use strict";

  const HttpServer = require("./http_server.js");

  module.exports = class Server {
    async start(contentDir, notFoundPageToServe, portNumber) {
      if (!portNumber) throw new Error("port number is required");

      this._httpServer = new HttpServer(contentDir, notFoundPageToServe);
      await this._httpServer.start(portNumber);
    }

    async stop() {
      if (this._httpServer === undefined) {
        throw new Error("stop() called before server started");
      }

      await this._httpServer.stop();
    }
  };
})();
