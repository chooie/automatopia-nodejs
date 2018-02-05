/*global desc, task, file, jake, rule, fail, complete, directory*/
(function() {
  "use strict";

  var paths = require("./config/paths.js");

  var strict = !process.env.loose;
  if (strict) console.log("For more forgiving test settings, use 'loose=true'");

  desc("This is the default task.");
  task("default", ["clean", "quick"], function (params) {
    console.log("This is the default task.");
  });

  desc("Delete all generated files");
  task("clean", [], function() {
    jake.rmRf(paths.generatedDir);
  });

  task("quick", [ "versions", "lint", "test" ]);

  desc("Check dependency versions");
  task("versions", [ "nodeVersion" ]);

  task("nodeVersion", [], function() {
    console.log("Checking Node.js version: .");
    var version = require("./version_checker.js");

    version.check({
      name: "Node",
      expected: require("../../package.json").engines.node,
      actual: process.version,
      strict: strict
    }, complete, fail);
  }, { async: true });


  //*** LINT

  desc("Lint everything");
  task("lint", [ "lintLog", "incrementalLint" ], function() {
    console.log();
  });

  task("lintLog", function() { process.stdout.write("Linting JavaScript: "); });

  task("incrementalLint", paths.lintDirectories());
  task("incrementalLint", paths.lintOutput());
  createDirectoryDependencies(paths.lintDirectories());

  rule(".lint", determineLintDependency, function() {
    var lint = require("./lint_runner.js");
    var lintConfig = require("./config/eslint.conf.js");

    var passed = lint.validateFile(this.source, lintConfig.options);
    if (passed) fs().writeFileSync(this.name, "lint ok");
    else fail("Lint failed");
  });

  function determineLintDependency(name) {
    var result = name.replace(/^generated\/incremental\/lint\//, "");
    return result.replace(/\.lint$/, "");
  }

  function createDirectoryDependencies(directories) {
    directories.forEach(function(lintDirectory) {
      directory(lintDirectory);
    });
  }

  //*** LAZY-LOADED MODULES

  function fs() {
    return require("fs");
  }

}());
