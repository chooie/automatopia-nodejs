(async function() {
  const server = require("./server.js");

  const CONTENT_DIR = "./generated/dist/client";

  const port = process.argv[2];
  const theServer = server.make();

  await theServer.start(CONTENT_DIR, "404.html", port);
  console.log(`Server started on port '${port}'`);
})();
