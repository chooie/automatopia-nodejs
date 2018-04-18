const assert = require("_assert");
const screen = require("./screen.js");
const mainStyle = require("./main_style.js");

describe("SHARED: Screen", function() {
  it("has classes", function() {
    const { classes } = screen.getSheetClassesAndText(mainStyle);
    const classesKeys = Object.keys(classes);
    assert.equal(classesKeys.length > 0, true);
  });
});
