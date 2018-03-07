/*global desc, task, jake, rule, fail, complete, directory*/
(function() {
  "use strict";

  var startTime = Date.now();

  // We've put most of our require statements in functions (or tasks) so we
  // don't have the overhead of loading modules we don't need. At the time this
  // refactoring was done, module loading took about half a second, which was
  // 10% of our desired maximum of five seconds for a quick build. The require
  // statements here are just the ones that are used to set up the tasks.
  var paths = require("./config/paths.js");

  var strict = !process.env.loose;
  if (strict) console.log("For more forgiving test settings, use 'loose=true'");

  //*** DIRECTORIES

  directory(paths.tempTestfileDir);
  directory(paths.buildDir);
  directory(paths.buildServerDir);
  directory(paths.buildSharedDir);
  directory(paths.buildClientDir);
  directory(paths.incrementalDir);

  //*** GENERAL

  jake.addListener('complete', function () {
    var elapsedSeconds = (Date.now() - startTime) / 1000;
    console.log("\n\nBUILD OK (" + elapsedSeconds.toFixed(2) + "s)");
  });

  desc("Show available tasks");
  task("default", function () {
    var sh = require("./sh.js");
    sh.run("./tasks.sh -T", function() {
      // Don't notify Jake so complete event is not triggered
      // Useful for not showing build complete message when we just want to see
      // a task list
    });
  }, {async: true});

  require("./tasks/test.js");

  desc("Delete all generated files");
  task("clean", [], function() {
    jake.rmRf(paths.generatedDir);
  });

  desc("Start Karma server for testing");
  task("karma", [ "versions" ], function() {
    karmaRunner().start({
      configFile: paths.karmaConfig
    }, complete, fail);
  }, { async: true });

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

  //*** BUILD DISTRIBUTION DIRECTORY

  desc("Bundle and build code");
  task("build", [ "server", "client" ]);

  task("server", [ paths.buildServerDir, paths.buildSharedDir ], function() {
    console.log("Collating server files: .");

    shell().rm("-rf", paths.buildDir + "/server/*");
    shell().rm("-rf", paths.buildDir + "/shared/*");
    shell().rm("-rf", paths.buildDir + "/node_modules/*");
    shell().cp(
      "-R",
      "src/application/server",
      "src/application/shared",
      "src/application/node_modules",
      paths.buildDir
    );
  });

  task("client", [ "cacheBust" ]);

  task("cacheBust", [ "collateClientFiles", "bundleClientJs" ], function() {
    process.stdout.write("Cache-busting CSS and JavaScript: ");

    var hashCatRunner = require("./hashcat_runner.js");
    hashCatRunner.go({
      files: [ // paths.buildClientIndexHtml, paths.buildClient404Html
      ]
    }, removeUnwantedFiles, fail);

    function removeUnwantedFiles() {
      shell().rm(paths.buildIntermediateFilesToErase());
      complete();
    }

  }, { async: true });

  task("collateClientFiles", [ paths.buildClientDir ], function() {
    console.log("Collating client files: .");

    shell().rm("-rf", paths.buildClientDir + "/*");
    // shell().cp(
    //   "-R",
    //   // "src/application/client/content/*",
    //   // "src/application/client/ui/vendor",
    //   // "src/client/network/vendor",
    //   paths.buildClientDir
    // );
  });

  task("bundleClientJs", [ paths.buildClientDir ], function() {
    process.stdout.write("Bundling client files with Browserify: ");

    var browserifyRunner = require("./browserify_runner.js");
    browserifyRunner.bundle({
      requires: [
        { path: "./src/application/client/main.js", expose: "./main.js" },
        // { path: "./src/client/ui/html_element.js", expose: "./html_element.js" },
        // { path: "./src/client/network/real_time_connection.js", expose: "./real_time_connection.js" }
      ],
      outfile: paths.buildClientDir + "/bundle.js",
      options: { debug: true }
    }, complete, fail);
  }, { async: true });

  //*** LAZY-LOADED MODULES

  function karmaRunner() {
    return require("simplebuild-karma");
  }

  function fs() {
    return require("fs");
  }

  function shell() {
    return require("shelljs");
  }

}());
