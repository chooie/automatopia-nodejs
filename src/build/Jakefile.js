/*global desc, task, file, jake, rule, fail, complete, directory*/
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

  desc("This is the default task.");
  task("default", [ "clean", "quick" ], function (params) {
    console.log("This is the default task.");
  });

  desc("Delete all generated files");
  task("clean", [], function() {
    jake.rmRf(paths.generatedDir);
  });

  task("quick", [ "versions", "lint", "test" ]);

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

  //*** TEST

  desc("Test everything (except smoke tests)");
  task("test", [ "testShared", "testServer", "testClient" ]);

  desc("Test client code");
  task(
    "testClient",
    [ "testClientUi", /* "testClientNetwork", "testClientCss" */ ]);

  desc("Test shared code");
  task("testShared", [ /*"testSharedOnServer", "testSharedOnClient" */ ]);

  desc("Test server code");
  incrementalTask(
    "testServer",
    [ paths.tempTestfileDir ],
    paths.serverTestDependencies(),
    function(complete, fail) {
      console.log("Testing server JavaScript: ");
      mochaRunner().runTests({
        files: paths.serverTestFiles(),
        options: mochaConfig()
      }, complete, fail);
    }
  );

  // incrementalTask("testSharedOnServer", [], paths.sharedJsTestDependencies(), function(complete, fail) {
  //   console.log("Testing shared JavaScript on server: ");
  //   mochaRunner().runTests({
  //     files: paths.sharedTestFiles(),
  //     options: mochaConfig()
  //   }, complete, fail);
  // });

  // incrementalTask("testSharedOnClient", [], paths.sharedJsTestDependencies(), function(complete, fail) {
  //   console.log("Testing shared JavaScript on client: ");
  //   runKarmaOnTaggedSubsetOfTests("SHARED", complete, fail);
  // });

  incrementalTask("testClientUi", [], paths.clientJsTestDependencies(), function(complete, fail) {
    console.log("Testing browser UI code: ");
    runKarmaOnTaggedSubsetOfTests("UI", complete, fail);
  });

  // incrementalTask("testClientCss", [], paths.cssTestDependencies(), function(complete, fail) {
  //   console.log("Testing CSS:");
  //   runKarmaOnTaggedSubsetOfTests("CSS", complete, fail);
  // });

  // incrementalTask("testClientNetwork", [], paths.clientNetworkTestDependencies(), function(complete, fail) {
  //   console.log("Testing browser networking code: ");

  //   var networkHarness = require("./src/client/network/__test_harness_server.js");

  //   var networkStopFn = networkHarness.start();
  //   runKarmaOnTaggedSubsetOfTests("NET", networkStopFn(complete), fail);
  // });

  function incrementalTask(
    taskName,
    taskDependencies,
    fileDependencies,
    action
  ) {
    var incrementalFile = paths.incrementalDir + "/" + taskName + ".task";

    task(
      taskName,
      taskDependencies.concat(paths.incrementalDir, incrementalFile)
    );
    file(incrementalFile, fileDependencies, function() {
      action(succeed, fail);
    }, {async: true});

    function succeed() {
      fs().writeFileSync(incrementalFile, "ok");
      complete();
    }
  }

  function runKarmaOnTaggedSubsetOfTests(tag, complete, fail) {
    karmaRunner().run({
      configFile: paths.karmaConfig,
      expectedBrowsers: testedBrowsers(),
      strict: strict,
      clientArgs: [ "--grep=" + tag + ":" ]
    }, complete, fail);
  }

  desc("End-to-end smoke tests");
  task("smoketest", [ "build" ], function(why) {
    console.log("Smoke testing app: ");
    mochaRunner().runTests({
      files: paths.smokeTestFiles(),
      options: mochaConfig()
    }, complete, fail);
  }, { async: true });


  //*** LAZY-LOADED MODULES

  function fs() {
    return require("fs");
  }

  function karmaRunner() {
    return require("simplebuild-karma");
  }

  function mochaRunner() {
    return require("./mocha_runner.js");
  }

  function mochaConfig() {
    return require("./config/mocha.conf.js");
  }

  function testedBrowsers() {
    return require("./config/tested_browsers.js");
  }

}());
