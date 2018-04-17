const jss = require("./vendor/jss-9.8.1.min.js").default;
const preset = require("./vendor/jss-preset-default-4.3.0.min.js").default;
const colors = require("./colors.js");

const style = {
  container: {
    margin: 0,
    padding: 0,
    marginBottom: "13px",
    background: colors.blue
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
