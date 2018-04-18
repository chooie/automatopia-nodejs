const assert = require("_assert");
const cssHelper = require("./_css_test_helper.js");
const colors = require("../../shared/colors.js");

describe("CSS: Layout", function() {
  cssHelper.setupUnitTests();

  it("has a background color", function() {
    const element = cssHelper.frame.add(
      `<div class="${cssHelper.frame.styleClasses.container}"></div>`,
      "element"
    );
    assert.equal(cssHelper.getBackgroundColor(element), colors.blue);
  });
});
