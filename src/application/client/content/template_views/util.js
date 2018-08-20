const head = require("./partials/head.js");
const footer = require("./partials/footer.js");

exports.makePageWithHeadAndBody = function makePageWithHeadAndBody(
  { headElements, bodyElements },
  googleAnalyticsIsActive
) {
  return exports.makeHtmlPage([
    ["head", ...headElements, ...head.make()],
    [
      "body",
      [
        "div",
        { id: "page-container", class: "page-container page-container--light" },
        ["div", { class: "main-content-container" }, ...bodyElements],
        footer.make()
      ]
    ]
  ]);
};

exports.makeHtmlPage = function makeHtmlPage(headAndBody) {
  return ["html", { lang: "en" }, ...headAndBody];
};
