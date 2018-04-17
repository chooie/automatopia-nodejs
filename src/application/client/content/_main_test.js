const assert = require("_assert");
const cssHelper = require("./_css_test_helper.js");
const screen = require("../../shared/screen.js");

describe("CSS: Layout", function() {
  cssHelper.setupUnitTests();
  let styleClasses;

  before(function() {
    styleClasses = screen.setupSheet(cssHelper.frame.body().toDomElement())
      .classes;
  });

  it("has a background color", function() {
    const element = cssHelper.frame.add(
      `<div class="${styleClasses.container}"></div>`,
      "element"
    );
    assert.equal(cssHelper.getBackgroundColor(element), screen.colors.blue);
  });
});
