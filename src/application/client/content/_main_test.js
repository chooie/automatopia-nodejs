(function() {
  "use strict";

  var assert = require("_assert");
  var cssHelper = require("./_css_test_helper.js");

  describe("CSS: Layout", function() {

    cssHelper.setupUnitTests();

    describe("Background", function() {

      var element;

      beforeEach(function() {
        element = cssHelper.frame.add(
          "<div class='container'></div>",
          "element"
        );
      });

      it("is the width of the iPad", function() {
        assert.equal("rgb(0, 191, 255)", cssHelper.backgroundColor(element));
      });

    });

  });

}());
