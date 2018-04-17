const assert = require("_assert");
const screen = require("./screen.js");

describe("SHARED: Screen", function() {
  it("has classes", function() {
    const { classes } = screen.getSheetText();
    const classesKeys = Object.keys(classes);
    assert.equal(classesKeys.length > 0, true);
  });
});
