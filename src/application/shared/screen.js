const jss = require("./vendor/jss-9.8.1.min.js").default;
const preset = require("./vendor/jss-preset-default-4.3.0.min.js").default;

exports.setupSheet = function setupSheet(styles, element) {
  const sheet = createStyleSheet(styles, element);
  return sheet.attach();
};

exports.getSheetClassesAndText = function(styles) {
  const sheet = createStyleSheet(styles);
  return {
    classes: sheet.classes,
    text: sheet.toString()
  };
};

function createStyleSheet(styles, element) {
  if (!styles) throw Error("Styles object required");

  jss.setup(preset());

  if (element) {
    jss.setup({
      insertionPoint: element
    });
  }
  return jss.createStyleSheet(styles);
}
