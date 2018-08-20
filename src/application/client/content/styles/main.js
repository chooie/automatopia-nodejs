const cssObjectToString = require("./cssObjectToString.js");

module.exports = cssObjectToString(styles());

function styles() {
  return {
    "*": {
      "box-sizing": "border-box"
    },

    body: {
      overflow: "auto",
      margin: 0,
      background: "rgb(255, 255, 255)"
    },

    // Prevent margin collapsing whereby child element margins are applied to
    // the parent
    ".page-container:before": {
      content: '""',
      display: "table"
    },

    ".page-container": {
      position: "relative",
      "text-align": "center",
      "margin-left": "auto",
      "margin-right": "auto",
      "min-height": "100vh"
    },

    ".page-container--light": {
      background: "#2b2b2b"
    },

    ".body": {
      "padding-bottom": "60px"
    },

    ".header": {
      display: "inline-block",
      "font-size": "10vw",
      "text-align": "center",
      color: "#fdfdfd"
    },

    ".catchy-text": {
      "font-size": "6vw",
      "font-weight": 600,
      "text-align": "center",
      color: "#a7a7a7",
      "margin-top": 0
    },

    ".container--contact-link": {
      "text-align": "center"
    },

    ".contact-link": {
      "font-size": "4vw",
      color: "#cdad00"
    },

    ".footer": {
      "font-size": "12px",
      "text-align": "left",
      color: "#fdfdfd",
      padding: "10px",
      "border-top": "1px solid #fdfdfd",
      position: "absolute",
      height: "60px",
      display: "flex",
      "align-items": "center",
      bottom: 0,
      left: 0,
      right: 0
    }
  };
}
