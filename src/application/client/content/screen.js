const jss = require("./vendor/jss-9.8.1.js").default;
const preset = require("./vendor/jss-preset-default-4.3.0.js").default;

const green = "rgb(0, 128, 0)";

exports.green = green;

const style = {
  greenthing: {
    background: green
  }
};

exports.setupSheet = function setupSheet(element) {
  jss.setup(preset());
  jss.setup({
    insertionPoint: element
  });

  const sheet = jss.createStyleSheet(style);
  return sheet.attach();
};
