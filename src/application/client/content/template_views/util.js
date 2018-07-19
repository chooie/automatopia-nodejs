exports.makeHtmlPage = function makeHtmlPage(headAndBody) {
  return ["html", { lang: "en" }, ...headAndBody];
};
