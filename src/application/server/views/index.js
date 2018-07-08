const head = require("./partials/head.js");

exports.page = function(options) {
  return [
    "html",
    [
      "head",
      "<!-- smoke test marker: App home page -->",
      ["title", "Home - Automatopia NodeJS"],
      ...head.make()
    ],
    [
      "body",
      ["h1", { id: "header-text" }, "Hello, world!"],
      ["script", { src: "bundle.js" }],
      [
        "script",
        'const client = require("./main.js");',
        "console.log(client.isTrue());"
      ]
    ]
  ];
};
