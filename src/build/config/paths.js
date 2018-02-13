(function() {
  "use strict";

  var glob = require("glob");
  var path = require("path");

  exports.generatedDir = "generated";
  exports.tempTestfileDir = exports.generatedDir + "/test";
  exports.incrementalDir = exports.generatedDir + "/incremental";
  exports.buildDir = exports.generatedDir + "/dist";
  exports.buildServerDir = exports.buildDir + "/server";
  exports.buildSharedDir = exports.buildDir + "/shared";
  exports.buildClientDir = exports.buildDir + "/client";
  exports.buildClientIndexHtml =
    exports.buildDir + "/client/index.html";
  exports.buildClient404Html = exports.buildDir + "/client/404.html";
  exports.buildIntermediateFilesToErase = function() {
    return deglob([
      exports.buildDir + "/client/_*",
      exports.buildDir + "/client/bundle.js",
      exports.buildDir + "/client/screen.css"
    ]);
  };

  exports.applicationSrc = "src/application";
  exports.karmaConfig = "src/build/config/karma.conf.js";

  exports.serverTestFiles = function() {
    return deglob(exports.applicationSrc + "/server/**/_*_test.js");
  };

  exports.sharedTestFiles = function() {
    return deglob([
      exports.applicationSrc + "/shared/**/_*_test.js",
      exports.applicationSrc + "/node_modules/**/_*_test.js"
    ]);
  };

  exports.cssTestDependencies = function() {
    return deglob([
      exports.applicationSrc + "/client/content/**/*",
      exports.applicationSrc + "/node_modules/**/*.js"
    ]);
  };

  exports.clientJsTestDependencies = function() {
    return deglob([
      exports.applicationSrc + "/client/ui/**/*.js",
      exports.applicationSrc + "/shared/**/*.js",
      exports.applicationSrc + "/node_modules/**/*.js"
    ]);
  };

  exports.sharedJsTestDependencies = function() {
    return deglob([
      exports.applicationSrc + "/shared/**/*.js",
      exports.applicationSrc + "/node_modules/**/*.js"
    ]);
  };

  exports.clientNetworkTestDependencies = function() {
    return deglob([
      exports.applicationSrc + "/client/network/**/*.js",
      exports.applicationSrc + "/shared/**/*.js",
      exports.applicationSrc + "/node_modules/**/*.js"
    ]);
  };

  exports.serverTestDependencies = function() {
    return deglob([
      exports.applicationSrc + "/server/**/*.js",
      exports.applicationSrc + "/shared/**/*.js",
      exports.applicationSrc + "/node_modules/**/*.js"
    ]);
  };

  exports.smokeTestFiles = function() {
    return deglob(exports.applicationSrc + "/_*_test.js");
  };

  exports.lintFiles = function() {
    return deglob([
      "*.js",
      exports.applicationSrc + "/**/*.js",
      "src/build/**/*.js"
    ], [
      "**/vendor/*.js"
    ]);
  };

  exports.lintOutput = function() {
    return exports.lintFiles().map(function(pathname) {
      return exports.generatedDir + "/incremental/lint/" + pathname + ".lint";
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
