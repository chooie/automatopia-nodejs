let assert = require("_assert");
let cssHelper = require("../_css_test_helper.js");

describe("CSS: Home page", function() {
  let frame;
  let body;
  let page;

  let pageContainer;
  let header;

  before(function(done) {
    /*eslint no-invalid-this:off */
    this.timeout(10 * 1000);
    var options = {
      src:
        "/base/src/application/client/content/template_views/index.page.html",
      width: cssHelper.smallestDeviceWidth
    };
    frame = cssHelper.createFrame(options, done);
  });

  after(function() {
    frame.remove();
  });

  beforeEach(function() {
    frame.reset();

    body = frame.body();
    page = frame.page();

    pageContainer = frame.get("#page-container");
    header = frame.get("#header");
  });

  describe("Page", function() {
    it("has a background color", function() {
      assert.equal(
        cssHelper.getBackgroundColor(frame.body()),
        cssHelper.backgroundColor
      );
    });
    describe("Page container", function() {
      it("takes up the whole page on small devices", function() {
        frame.resize(cssHelper.smallestDeviceWidth, 500);
        const paddingWidthValue = cssHelper.getPaddingWidthValue(body);
        pageContainer.assert({
          width: body.width.minus(paddingWidthValue)
        });
      });

      it("is centered in the page and sits against the top", function() {
        const paddingTop = body.getRawStyle("padding-top");
        const paddingTopValue = cssHelper.pixelsFloatValue(paddingTop);
        pageContainer.assert({
          top: body.top.plus(paddingTopValue),
          center: page.center
        });
      });

      it("is colored", function() {
        assert.equal(
          cssHelper.getBackgroundColor(pageContainer),
          cssHelper.pageBackgroundColor
        );
      });
    });
  });

  describe("Header", function() {
    it("is centered", function() {
      assert.equal(header.getRawStyle("text-align"), "center");
    });

    it("has a color scheme", function() {
      assert.equal(cssHelper.textColor(header), cssHelper.headerTextColor);
    });

    it("is big", function() {
      assert.equal(cssHelper.fontSize(header), "32px");
    });

    it("is even bigger on wider devices", function() {
      frame.resize(cssHelper.mediumDeviceWidth, 500);
      assert.equal(cssHelper.fontSize(header), "64px");
    });
  });
});
