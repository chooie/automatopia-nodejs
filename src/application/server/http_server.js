const express = require("express");
const fs = require("fs");
const path = require("path");
const util = require("util");

const screen = require("../shared/screen.js");
const styleSheet = screen.getSheetClassesAndText();

exports.make = function make(portNumber, contentDir, notFoundPageToServe) {
  const httpServer = express();

  httpServer.set("views", "src/application/client/content");
  httpServer.set("view engine", "pug");

  httpServer.get("/", function(req, res) {
    res.render("index", {
      title: "Home - Automatopia NodeJS",
      classes: styleSheet.classes,
      cssText: styleSheet.text
    });
  });

  httpServer.use(express.static(contentDir));
  httpServer.use(function(req, res, next) {
    res.status(404).render("404", {
      title: "Not Found - Automatopia NodeJS",
      classes: styleSheet.classes,
      cssText: styleSheet.text
    });
  });

  return {
    start() {
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
