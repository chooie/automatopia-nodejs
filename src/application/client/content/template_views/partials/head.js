const mainStyles = require("../../styles/main.js");
const normalizeStyles = require("../../styles/normalize.js");

exports.make = function make() {
  return [
    [
      "meta",
      { name: "viewport", content: "width=device-width, initial-scale=1" }
    ],
    ["style", normalizeStyles],
    ["style", mainStyles],
    [
      "link",
      { rel: "shortcut icon", type: "image/png", href: "../nodejs-512.png" }
    ]
  ];
};
