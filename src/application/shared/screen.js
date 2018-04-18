const jss = require("./vendor/jss-9.8.1.min.js").default;
const preset = require("./vendor/jss-preset-default-4.3.0.min.js").default;

exports.setupSheet = function setupSheet(styles, element) {
  jss.setup(preset());
  jss.setup({
    insertionPoint: element
  });

  const sheet = jss.createStyleSheet(styles);
  return sheet.attach();
};

exports.getSheetClassesAndText = function(styles) {
  jss.setup(preset());
  const sheet = jss.createStyleSheet(styles);
  return {
    classes: sheet.classes,
    text: sheet.toString()
  };
};
