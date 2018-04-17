const jss = require("./vendor/jss-9.8.1.js").default;
const preset = require("./vendor/jss-preset-default-4.3.0.js").default;

const green = "rgb(0, 128, 0)";
const blue = "rgb(0, 191, 255)";

exports.colors = {
  blue
};

const style = {
  container: {
    margin: 0,
    padding: 0,
    marginBottom: "13px",
    background: blue
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

exports.getSheetClassesAndText = function() {
  jss.setup(preset());
  const sheet = jss.createStyleSheet(style);
  return {
    classes: sheet.classes,
    text: sheet.toString()
  };
};
