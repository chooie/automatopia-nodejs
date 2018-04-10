const child_process = require("child_process");
const fs = require("fs");
const procfile = require("procfile");

const config = require("../application/shared/config.js");

exports.runInteractively = function() {
  return run("inherit");
};

exports.runProgrammatically = function(callback) {
  const serverProcess = runOnlyWithStdErr();

  serverProcess.stdout.setEncoding("utf8");
  serverProcess.stdout.on("data", function(chunk) {
    if (chunk.trim().indexOf("Server started") !== -1) {
      callback(serverProcess);
    }
  });
};

function runOnlyWithStdErr() {
  const serverProcess = run(["pipe", "pipe", process.stderr]);
  return serverProcess;
}

function run(stdioOptions) {
  const commandLine = parseProcFile();
  return child_process.spawn(commandLine.command, commandLine.options, {
    stdio: stdioOptions
  });
}

function parseProcFile() {
  const fileData = fs.readFileSync("Procfile", "utf8");
  const webCommand = procfile.parse(fileData).web;
  webCommand.options = webCommand.options.map(function(element) {
    if (element === "$PORT") return config.defaultPort;
    else return element;
  });
  return webCommand;
}
