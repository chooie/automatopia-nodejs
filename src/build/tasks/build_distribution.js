/*global namespace, desc, task, fail, complete*/
(function() {
  "use strict";

  var paths = require("../config/paths.js");

  namespace("build", function() {

    desc("Bundle and build code");
    task("all", [ "server", "client" ]);

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

      var hashCatRunner = require("../hashcat_runner.js");
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

      var browserifyRunner = require("../browserify_runner.js");
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

  });

  function shell() {
    return require("shelljs");
  }

}());
