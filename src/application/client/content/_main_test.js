const assert = require("_assert");
const cssHelper = require("./_css_test_helper.js");

describe("CSS: Layout", function() {
  cssHelper.setupUnitTests();

  describe("Background", function() {
    it("is the width of the iPad", function() {
      const element = cssHelper.frame.add(
        "<div class='container'></div>",
        "element"
      );
      assert.equal("rgb(0, 191, 255)", cssHelper.backgroundColor(element));
    });
  });
});
