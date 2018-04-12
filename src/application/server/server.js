const httpServer = require("./http_server.js");

exports.make = function server() {
  return {
    async start(contentDir, notFoundPageToServe, portNumber) {
      if (!portNumber) throw new Error("port number is required");

      this._httpServer = httpServer.make(contentDir, notFoundPageToServe);
      await this._httpServer.start(portNumber);
    },

    async stop() {
      if (this._httpServer === undefined) {
        throw new Error("stop() called before server started");
      }

      await this._httpServer.stop();
    }
  };
};
