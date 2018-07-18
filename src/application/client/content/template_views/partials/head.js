exports.make = function make() {
  return [
    [
      "meta",
      { name: "viewport", content: "width=device-width, initial-scale=1" }
    ],
    [
      "link",
      {
        rel: "stylesheet",
        type: "text/css",
        href: "../styles/vendor/normalize-3.0.2.css"
      }
    ],
    [
      "link",
      { rel: "stylesheet", type: "text/css", href: "../styles/main.css" }
    ],
    [
      "link",
      { rel: "shortcut icon", type: "image/png", href: "../nodejs-512.png" }
    ]
  ];
};
