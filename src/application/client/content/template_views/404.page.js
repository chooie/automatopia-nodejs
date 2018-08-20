const util = require("./util.js");

exports.page = function(options) {
  return util.makePageWithHeadAndBody({
    headElements: [
      "<!-- smoke test marker: App 404 page -->",
      ["title", "Page Not Found - Automatopia NodeJS"]
    ],
    bodyElements: [
      ["h1", { id: "header", class: "header" }, "Page Not Found"],
      [
        "div",
        { id: "contact-link-container", class: "container--contact-link" },
        [
          "a",
          { id: "contact-link", class: "contact-link", href: "/" },
          "Go Home"
        ]
      ]
    ]
  });
};
