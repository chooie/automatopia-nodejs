const preformatted = require("_preformatted");
const util = require("./util.js");

exports.page = function(options) {
  return util.makePageWithHeadAndBody({
    headElements: [
      "<!-- smoke test marker: App home page -->",
      ["title", "Home - Automatopia NodeJS"]
    ],
    bodyElements: [
      ["h1", { id: "header", class: "header" }, "Automatopia NodeJS"],
      ["script", { src: "bundle.js" }],
      [
        "script",
        preformatted`
          const client = require("./main.js");
          console.log(client.isTrue());
        `
      ]
    ]
  });
};
