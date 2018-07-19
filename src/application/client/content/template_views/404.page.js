const head = require("./partials/head.js");
const footer = require("./partials/footer.js");
const util = require("./util.js");

exports.page = function(options) {
  return util.makeHtmlPage([
    [
      "head",
      "<!-- smoke test marker: App 404 page -->",
      ["title", "Page Not Found - Automatopia NodeJS"],
      ...head.make()
    ],
    [
      "body",
      [
        "div",
        { id: "page-container", class: "page-container page-container--light" },
        ["h1", { id: "header", class: "header" }, "Page Not Found"],
        [
          "div",
          { id: "contact-link-container", class: "container--contact-link" },
          [
            "a",
            { id: "contact-link", class: "contact-link", href: "/" },
            "Go Home"
          ]
        ],
        footer.make()
      ]
    ]
  ]);
};
