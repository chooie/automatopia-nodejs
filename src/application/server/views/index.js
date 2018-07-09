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
      [
        "div",
        { id: "page-container", class: "page-container page-container--light" },
        ["h1", { id: "header", class: "header" }, "Automatopia NodeJS"]
      ],
      ["script", { src: "bundle.js" }],
      [
        "script",
        'const client = require("./main.js");',
        "console.log(client.isTrue());"
      ]
    ]
  ];
};
