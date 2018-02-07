(function() {
  "use strict";

  var glob = require("glob");
  var path = require("path");

  exports.generatedDir = "generated";
  exports.tempTestfileDir = "generated/test";
  exports.incrementalDir = "generated/incremental";

  exports.buildDir = "generated/dist";
  exports.buildServerDir = "generated/dist/server";
  exports.buildSharedDir = "generated/dist/shared";
  exports.buildClientDir = "generated/dist/client";
  exports.buildClientIndexHtml = "generated/dist/client/index.html";
  exports.buildClient404Html = "generated/dist/client/404.html";
  exports.buildIntermediateFilesToErase = function() {
    return deglob([
      "./generated/dist/client/_*",
      "./generated/dist/client/bundle.js",
      "./generated/dist/client/screen.css"
    ]);
  };

  exports.karmaConfig = "./src/build/config/karma.conf.js";

  exports.serverTestFiles = function() {
    return deglob("src/application/server/**/_*_test.js");
  };

  exports.sharedTestFiles = function() {
    return deglob([
      "src/application/shared/**/_*_test.js",
      "src/application/node_modules/**/_*_test.js"
    ]);
  };

  exports.cssTestDependencies = function() {
    return deglob([
      "src/application/client/content/**/*",
      "src/application/node_modules/**/*.js"
    ]);
  };

  exports.clientJsTestDependencies = function() {
    return deglob([
      "src/application/client/ui/**/*.js",
      "src/application/shared/**/*.js",
      "src/application/node_modules/**/*.js"
    ]);
  };

  exports.sharedJsTestDependencies = function() {
    return deglob([
      "src/application/shared/**/*.js",
      "src/application/node_modules/**/*.js"
    ]);
  };

  exports.clientNetworkTestDependencies = function() {
    return deglob([
      "src/application/client/network/**/*.js",
      "src/application/shared/**/*.js",
      "src/application/node_modules/**/*.js"
    ]);
  };

  exports.serverTestDependencies = function() {
    return deglob([
      "src/application/server/**/*.js",
      "src/application/shared/**/*.js",
      "src/application/node_modules/**/*.js"
    ]);
  };

  exports.smokeTestFiles = function() {
    return deglob("src/application/_*_test.js");
  };

  exports.lintFiles = function() {
    return deglob([
      "*.js",
      "src/application/**/*.js",
      "src/build/**/*.js"
    ], [
      "**/vendor/*.js"
    ]);
  };

  exports.lintOutput = function() {
    return exports.lintFiles().map(function(pathname) {
      return "generated/incremental/lint/" + pathname + ".lint";
    });
  };

  exports.lintDirectories = function() {
    return exports.lintOutput().map(function(lintDependency) {
      return path.dirname(lintDependency);
    });
  };

  function deglob(patternsToFind, patternsToIgnore) {
    var globPattern = patternsToFind;
    if (Array.isArray(patternsToFind)) {
      if (patternsToFind.length === 1) {
        globPattern = patternsToFind[0];
      }
      else {
        globPattern = "{" + patternsToFind.join(",") + "}";
      }
    }

    return glob.sync(globPattern, { ignore: patternsToIgnore });
  }

}());
