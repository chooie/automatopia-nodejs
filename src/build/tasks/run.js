/*global desc, task */
desc("Start localhost server for manual testing");
task(
  "run",
  ["nodeVersion", "build:all"],
  function() {
    const runServer = require("../../application/_run_server.js");

    console.log("Running server. Press Ctrl-C to stop.");
    runServer.runInteractively();
    // We never call complete() because we want the task to hang until the user
    // presses 'Ctrl-C'.
  },
  { async: true }
);
