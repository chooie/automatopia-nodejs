(function() {
  "use strict";

  var jake = require("jake");

  exports.run = function(
    oneCommand,
    successCallback,
    failureCallback,
    options
  ) {
    options = options || {};
    var suppressOutput = options.suppressOutput === true;

    var stdout = "";
    var child = jake.createExec(oneCommand, {
      printStdout: true,
      printStderr: true
    });
    child.on("stdout", function(data) {
      if (!suppressOutput) process.stdout.write(data);
      stdout += data;
    });
    child.on("stderr", function(data) {
      process.stderr.write(data);
    });
    child.on("cmdEnd", function() {
      successCallback(stdout);
    });
    child.on("error", function() {
      failureCallback(stdout);
    });

    if (!suppressOutput) console.log("> " + oneCommand);
    child.run();
  };

  exports.runMany = function(commands, successCallback, failureCallback) {
    var stdout = [];
    serializedSh(commands.shift());

    function serializedSh(command) {
      if (command) {
        exports.run(
          command,
          function(oneStdout) {
            stdout.push(oneStdout);
            serializedSh(commands.shift());
          },
          failureCallback
        );
      } else {
        successCallback(stdout);
      }
    }
  };
})();
