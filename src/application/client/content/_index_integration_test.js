let assert = require("_assert");
let cssHelper = require("./_css_test_helper.js");
const screen = require("../../shared/screen.js");

describe("CSS: Home page", function() {
  let frame;
  let styleClasses;

  let greenElement;

  before(function(done) {
    this.timeout(10 * 1000);
    var options = {
      src: "/base/src/application/client/content/index.html",
      width: cssHelper.smallestDeviceWidth
    };
    frame = cssHelper.createFrame(options, function(err, frame) {
      if (err) throw Error(err);
      styleClasses = screen.setupSheet(frame.body().toDomElement()).classes;
      done();
    });
  });

  after(function() {
    frame.remove();
  });

  beforeEach(function() {
    frame.reset();
    greenElement = frame.get("#green-element");
  });

  it("has a background color", function() {
    assert.equal(
      cssHelper.getBackgroundColor(frame.body()),
      screen.colors.blue
    );
  });

  it("works with jss", function() {
    cssHelper.applyClass(greenElement, styleClasses.greenthing, function() {
      assert.equal(
        cssHelper.getBackgroundColor(greenElement),
        screen.colors.green
      );
    });
  });
});
